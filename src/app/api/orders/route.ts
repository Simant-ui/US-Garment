import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getSessionUser, getAdminUser } from '@/lib/auth';
import { checkoutSchema } from '@/validations/order.schema';
import { getPaymentProvider } from '@/lib/payments';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const admin = await getAdminUser(req);
    const session = await getSessionUser(req);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const skip = (page - 1) * limit;

    let query: any = {};

    if (admin) {
      if (status) query.status = status;
    } else if (session) {
      query.user = session.userId;
    } else {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
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
    await connectDB();
    const session = await getSessionUser(req);
    const body = await req.json();

    const { items, shippingAddress, paymentMethod, couponCode, orderNotes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
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
    const orderItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) {
        return NextResponse.json({ success: false, error: `Product ${item.name} no longer exists.` }, { status: 400 });
      }

      const itemTotal = dbProduct.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        sku: dbProduct.sku,
        image: item.image || dbProduct.thumbnail,
        price: dbProduct.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        total: itemTotal,
      });

      // Deduct stock
      dbProduct.stock = Math.max(0, dbProduct.stock - item.quantity);
      await dbProduct.save();
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

    const newOrder = await Order.create({
      orderNumber,
      user: session ? session.userId : undefined,
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
      items: orderItems,
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
          timestamp: new Date(),
        },
      ],
      orderNotes,
    });

    // Process payment abstraction
    const paymentProvider = getPaymentProvider(paymentMethod);
    const paymentResult = await paymentProvider.processPayment({
      orderId: newOrder._id.toString(),
      amount: totalAmount,
      customerName: shippingAddress.fullName,
      customerEmail: shippingAddress.email || 'customer@example.com',
      customerPhone: shippingAddress.phone,
      returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order-success/${newOrder._id}`,
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
