import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CustomOrder from '@/models/CustomOrder';
import { getAdminUser } from '@/lib/auth';
import { customOrderSchema } from '@/validations/customOrder.schema';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const query: any = {};
    if (status) query.status = status;

    const customOrders = await CustomOrder.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, customOrders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const validation = customOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.issues[0].message }, { status: 400 });
    }

    const requestNumber = `CST-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newCustomOrder = await CustomOrder.create({
      ...validation.data,
      requestNumber,
      status: 'New',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your custom order inquiry has been submitted successfully.',
        requestNumber: newCustomOrder.requestNumber,
        customOrder: newCustomOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Submit custom order error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
