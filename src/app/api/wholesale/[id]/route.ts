import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WholesaleInquiry from '@/models/WholesaleInquiry';
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

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updated = await WholesaleInquiry.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Wholesale inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Status updated', wholesaleInquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
