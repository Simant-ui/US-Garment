import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';
import { wholesaleInquirySchema } from '@/validations/wholesale.schema';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) where.status = status;

    const wholesaleInquiries = await prisma.wholesaleInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, wholesaleInquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = wholesaleInquirySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.issues[0].message }, { status: 400 });
    }

    const inquiryNumber = `BULK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newInquiry = await prisma.wholesaleInquiry.create({
      data: {
        ...(validation.data as any),
        inquiryNumber,
        status: 'New',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your bulk wholesale inquiry has been submitted successfully.',
        inquiryNumber: newInquiry.inquiryNumber,
        wholesaleInquiry: newInquiry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Submit wholesale inquiry error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
