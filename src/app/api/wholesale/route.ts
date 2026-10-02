import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WholesaleInquiry from '@/models/WholesaleInquiry';
import { getAdminUser } from '@/lib/auth';
import { wholesaleInquirySchema } from '@/validations/wholesale.schema';

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

    const wholesaleInquiries = await WholesaleInquiry.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, wholesaleInquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const validation = wholesaleInquirySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.issues[0].message }, { status: 400 });
    }

    const inquiryNumber = `BULK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newInquiry = await WholesaleInquiry.create({
      ...validation.data,
      inquiryNumber,
      status: 'New',
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
