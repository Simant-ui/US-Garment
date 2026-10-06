import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser, getAdminUser } from '@/lib/auth';
import { checkoutSchema } from '@/validations/order.schema';
import { getPaymentProvider } from '@/lib/payments';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminUser(req);
    const session = await getSessionUser(req);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const skip = (page - 1) * limit;

    let where: any = {};

    if (admin) {
      if (status) where.status = status;
    } else if (session) {
      where.userId = session.userId;
    } else {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    const body = await req.json();

    const { items, shippingAddress, paymentMethod, couponCode, orderNotes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress || typeof shippingAddress !== 'object') {
      return NextResponse.json({ success: false, error: 'Shipping address details are required' }, { status: 400 });
    }

    const validation = checkoutSchema.safeParse({
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      email: shippingAddress.email || 'customer@example.com',
      province: shippingAddress.province,
      district: shippingAddress.district,
      city: shippingAddress.city,
      addressLine: shippingAddress.addressLine,
      landmark: shippingAddress.landmark,
      paymentMethod,
      couponCode,
      orderNotes,
    });

    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.issues[0].message }, { status: 400 });
    }

    // Calculate subtotal & verify stock
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const dbProduct = await prisma.product.findFirst({
        where: { OR: [{ id: item.productId }, { slug: item.productId }] },
      });

      if (!dbProduct) {
        return NextResponse.json({ success: false, error: `Product ${item.name || item.productId} no longer exists.` }, { status: 400 });
      }

      const itemTotal = dbProduct.price * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: dbProduct.id,
        name: dbProduct.name,
        sku: dbProduct.sku,
        image: item.image || dbProduct.thumbnail,
        price: dbProduct.price,
        size: item.size || null,
        color: item.color || null,
        quantity: item.quantity,
        total: itemTotal,
      });

      // Deduct stock
      await prisma.product.update({
        where: { id: dbProduct.id },
        data: { stock: Math.max(0, dbProduct.stock - item.quantity) },
      });
    }

    // Coupon discount logic
    let discount = 0;
    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      if (cleanCode === 'FESTIVE10' || cleanCode === 'WELCOME10') discount = Math.round(subtotal * 0.1);
      if (cleanCode === 'GARMENT20' || cleanCode === 'BULK20') discount = Math.round(subtotal * 0.2);
    }

    const shippingFee = subtotal >= 3000 ? 0 : 150;
    const totalAmount = Math.max(0, subtotal - discount + shippingFee);

    const orderNumber = `USD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: session ? session.userId : null,
        guestCustomer: !session
          ? {
              name: shippingAddress.fullName,
              email: shippingAddress.email,
              phone: shippingAddress.phone,
            }
          : undefined,
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          province: shippingAddress.province,
          district: shippingAddress.district,
          city: shippingAddress.city,
          addressLine: shippingAddress.addressLine,
          landmark: shippingAddress.landmark,
        },
        items: {
          create: orderItemsData,
        },
        subtotal,
        discount,
        shippingFee,
        totalAmount,
        couponCode,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        status: 'Pending',
        statusHistory: [
          {
            status: 'Pending',
            updatedBy: session ? session.name : 'Customer Guest Checkout',
            comment: 'Order placed by customer',
            timestamp: new Date().toISOString(),
          },
        ],
        orderNotes,
      },
      include: {
        items: true,
      },
    });

    // Process payment abstraction
    const paymentProvider = getPaymentProvider(paymentMethod);
    const paymentResult = await paymentProvider.processPayment({
      orderId: newOrder.id,
      amount: totalAmount,
      customerName: shippingAddress.fullName,
      customerEmail: shippingAddress.email || 'customer@example.com',
      customerPhone: shippingAddress.phone,
      returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/order-success/${newOrder.id}`,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        order: newOrder,
        paymentResult,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
