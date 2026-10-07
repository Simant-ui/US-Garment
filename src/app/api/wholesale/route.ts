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

    let wholesaleInquiries: any[] = [];
    try {
      const where: any = {};
      if (status) where.status = status;
      wholesaleInquiries = await prisma.wholesaleInquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      console.warn('Prisma wholesale findMany fallback to raw SQL:', dbErr);
      if (status) {
        wholesaleInquiries = await prisma.$queryRawUnsafe(
          'SELECT * FROM wholesale_inquiries WHERE status = ? ORDER BY createdAt DESC',
          status
        );
      } else {
        wholesaleInquiries = await prisma.$queryRawUnsafe(
          'SELECT * FROM wholesale_inquiries ORDER BY createdAt DESC'
        );
      }
    }

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

    const {
      organizationName,
      contactPerson,
      phone,
      email,
      productType,
      estimatedQuantity,
      budgetRange,
      requiredDate,
      location,
      description,
    } = validation.data;

    const inquiryNumber = `BULK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const id = `blk_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();

    let createdInquiry: any = null;
    try {
      createdInquiry = await prisma.wholesaleInquiry.create({
        data: {
          inquiryNumber,
          organizationName,
          contactPerson,
          phone,
          email,
          productType,
          estimatedQuantity: Number(estimatedQuantity || 10),
          location: location || null,
          budgetRange: budgetRange || null,
          requiredDate: requiredDate || null,
          description: description || null,
          status: 'New',
        },
      });
    } catch (createErr) {
      console.warn('Prisma wholesale create fallback to raw SQL insert:', createErr);
      await prisma.$executeRawUnsafe(
        `INSERT INTO wholesale_inquiries (id, inquiryNumber, organizationName, contactPerson, email, phone, location, productType, estimatedQuantity, budgetRange, requiredDate, description, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        inquiryNumber,
        organizationName,
        contactPerson,
        email,
        phone,
        location || null,
        productType,
        Number(estimatedQuantity || 10),
        budgetRange || null,
        requiredDate || null,
        description || null,
        'New',
        now,
        now
      );
      createdInquiry = {
        id,
        inquiryNumber,
        organizationName,
        contactPerson,
        email,
        phone,
        location: location || null,
        productType,
        estimatedQuantity: Number(estimatedQuantity || 10),
        budgetRange: budgetRange || null,
        requiredDate: requiredDate || null,
        description: description || null,
        status: 'New',
        createdAt: now,
        updatedAt: now,
      };
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your bulk wholesale inquiry has been submitted successfully.',
        inquiryNumber: createdInquiry.inquiryNumber || inquiryNumber,
        wholesaleInquiry: createdInquiry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Submit wholesale inquiry error:', error);
    let userFriendlyError = 'Unable to submit your bulk wholesale inquiry. Please verify your entries and try again.';
    if (error?.code === 'P2002' || error?.message?.includes('Unique constraint')) {
      userFriendlyError = 'An inquiry with this reference number already exists. Please submit again.';
    }
    return NextResponse.json({ success: false, error: userFriendlyError }, { status: 400 });
  }
}
