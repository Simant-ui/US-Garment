import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminUser, getSessionUser } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await getAdminUser(req);
    const session = await getSessionUser(req);

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (!admin) {
      if (order.userId) {
        if (!session || order.userId !== session.userId) {
          return NextResponse.json({ success: false, error: 'Unauthorized to view this order' }, { status: 403 });
        }
      }
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

    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus, comment } = body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const previousStatus = order.status;
    let statusHistory: any[] = Array.isArray(order.statusHistory) ? (order.statusHistory as any[]) : [];

    if (status && status !== order.status) {
      statusHistory.push({
        status,
        updatedBy: admin.name || admin.email,
        comment: comment || `Status updated from ${previousStatus} to ${status}`,
        timestamp: new Date().toISOString(),
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(status ? { status: status as any } : {}),
        ...(paymentStatus ? { paymentStatus: paymentStatus as any } : {}),
        statusHistory,
      },
      include: { items: true },
    });

    // Create Audit Log entry
    await createAuditLog({
      action: 'UPDATE_ORDER_STATUS',
      performedBy: admin.userId,
      performedByName: admin.name || admin.email,
      targetType: 'Order',
      targetId: order.id,
      details: { previousStatus, newStatus: status, paymentStatus },
    });

    return NextResponse.json({ success: true, message: 'Order updated successfully', order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
