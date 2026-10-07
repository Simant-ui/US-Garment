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
      updated = await prisma.wholesaleInquiry.update({
        where: { id },
        data: body,
      });
    } catch (err) {
      console.warn('Prisma wholesale update fallback to raw SQL:', err);
      if (status !== undefined) {
        await prisma.$executeRawUnsafe(
          'UPDATE wholesale_inquiries SET status = ?, updatedAt = NOW() WHERE id = ? OR inquiryNumber = ?',
          status,
          id,
          id
        );
      }
      if (adminNotes !== undefined) {
        await prisma.$executeRawUnsafe(
          'UPDATE wholesale_inquiries SET adminNotes = ?, updatedAt = NOW() WHERE id = ? OR inquiryNumber = ?',
          adminNotes,
          id,
          id
        );
      }
      updated = { id, status, adminNotes };
    }

    return NextResponse.json({ success: true, message: 'Status updated', wholesaleInquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
