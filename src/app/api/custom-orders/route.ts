import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';
import { customOrderSchema } from '@/validations/customOrder.schema';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let customOrders: any[] = [];
    try {
      const where: any = {};
      if (status) where.status = status;
      customOrders = await prisma.customOrder.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      console.warn('Prisma findMany fallback to raw SQL:', dbErr);
      if (status) {
        customOrders = await prisma.$queryRawUnsafe(
          'SELECT * FROM custom_orders WHERE status = ? ORDER BY createdAt DESC',
          status
        );
      } else {
        customOrders = await prisma.$queryRawUnsafe(
          'SELECT * FROM custom_orders ORDER BY createdAt DESC'
        );
      }
    }

    const formattedCustomOrders = (customOrders || []).map((order: any) => ({
      ...order,
      mobileNumber: order.phone || order.mobileNumber || '',
    }));
    return NextResponse.json({ success: true, customOrders: formattedCustomOrders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = customOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.issues[0].message }, { status: 400 });
    }

    const {
      fullName,
      mobileNumber,
      email,
      garmentType,
      quantity,
      size,
      color,
      fabricPreference,
      designRequirement,
      deliveryLocation,
      requiredDate,
      additionalMessage,
      referenceImages,
    } = validation.data;

    const requestNumber = `CST-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const id = `cst_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();

    let createdOrder: any = null;
    try {
      createdOrder = await prisma.customOrder.create({
        data: {
          requestNumber,
          fullName,
          phone: mobileNumber || '',
          email,
          garmentType,
          gender: 'Unspecified',
          measurements: {},
          quantity: Number(quantity) || 1,
          size: size || null,
          color: color || null,
          fabricPreference: fabricPreference || null,
          designRequirement: designRequirement || null,
          deliveryLocation: deliveryLocation || null,
          requiredDate: requiredDate || null,
          additionalMessage: additionalMessage || null,
          referenceImages: referenceImages || [],
          status: 'New',
        },
      });
    } catch (createErr) {
      console.warn('Prisma create fallback to raw SQL insert:', createErr);
      await prisma.$executeRawUnsafe(
        `INSERT INTO custom_orders (id, requestNumber, fullName, phone, email, garmentType, gender, measurements, quantity, size, color, fabricPreference, designRequirement, deliveryLocation, requiredDate, additionalMessage, referenceImages, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        requestNumber,
        fullName,
        mobileNumber || '',
        email,
        garmentType,
        'Unspecified',
        '{}',
        Number(quantity) || 1,
        size || null,
        color || null,
        fabricPreference || null,
        designRequirement || null,
        deliveryLocation || null,
        requiredDate || null,
        additionalMessage || null,
        JSON.stringify(referenceImages || []),
        'New',
        now,
        now
      );
      createdOrder = {
        id,
        requestNumber,
        fullName,
        phone: mobileNumber || '',
        email,
        garmentType,
        gender: 'Unspecified',
        quantity: Number(quantity) || 1,
        size,
        color,
        fabricPreference,
        designRequirement,
        deliveryLocation,
        requiredDate,
        additionalMessage,
        referenceImages: referenceImages || [],
        status: 'New',
        createdAt: now,
        updatedAt: now,
      };
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your custom order inquiry has been submitted successfully.',
        requestNumber: createdOrder.requestNumber || requestNumber,
        customOrder: {
          ...createdOrder,
          mobileNumber: createdOrder.phone || mobileNumber,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Submit custom order error:', error);
    let userFriendlyError = 'Unable to process your custom tailoring inquiry. Please check your details and try again.';
    if (error?.code === 'P2002' || error?.message?.includes('Unique constraint')) {
      userFriendlyError = 'A request with this reference code already exists. Please submit again.';
    }
    return NextResponse.json({ success: false, error: userFriendlyError }, { status: 400 });
  }
}
