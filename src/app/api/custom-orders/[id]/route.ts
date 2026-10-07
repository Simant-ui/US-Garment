import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';

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

    const { status, adminNotes } = body;

    let updated: any = null;
    try {
      updated = await prisma.customOrder.update({
        where: { id },
        data: body,
      });
    } catch (err) {
      console.warn('Prisma custom order update fallback to raw SQL:', err);
      if (status !== undefined) {
        await prisma.$executeRawUnsafe(
          'UPDATE custom_orders SET status = ?, updatedAt = NOW() WHERE id = ? OR requestNumber = ?',
          status,
          id,
          id
        );
      }
      if (adminNotes !== undefined) {
        await prisma.$executeRawUnsafe(
          'UPDATE custom_orders SET adminNotes = ?, updatedAt = NOW() WHERE id = ? OR requestNumber = ?',
          adminNotes,
          id,
          id
        );
      }
      updated = { id, status, adminNotes };
    }

    return NextResponse.json({ success: true, message: 'Status updated', customOrder: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
