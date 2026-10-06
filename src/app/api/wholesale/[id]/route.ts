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

    const existing = await prisma.wholesaleInquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Wholesale inquiry not found' }, { status: 404 });
    }

    const updated = await prisma.wholesaleInquiry.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, message: 'Status updated', wholesaleInquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
