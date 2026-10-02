import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getAdminUser, getSessionUser } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const admin = await getAdminUser(req);
    const session = await getSessionUser(req);

    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (!admin && session && order.user && order.user.toString() !== session.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized to view this order' }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus, comment } = body;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const previousStatus = order.status;

    if (status && status !== order.status) {
      order.status = status;
      order.statusHistory.push({
        status,
        updatedBy: admin.name || admin.email,
        comment: comment || `Status updated from ${previousStatus} to ${status}`,
        timestamp: new Date(),
      });
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    // Create Audit Log entry
    await createAuditLog({
      action: 'UPDATE_ORDER_STATUS',
      performedBy: admin.userId,
      performedByName: admin.name || admin.email,
      targetType: 'Order',
      targetId: order._id.toString(),
      details: { previousStatus, newStatus: status, paymentStatus },
    });

    return NextResponse.json({ success: true, message: 'Order updated successfully', order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
