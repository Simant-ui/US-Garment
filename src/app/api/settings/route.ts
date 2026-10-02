import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { getAdminUser } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create({
        businessName: 'US Dresses and Garment Udyog',
        logo: '/images/logo.png',
        phone: '+977 9855012345',
        whatsapp: '+9779855012345',
        email: 'info@usdresses.com.np',
        address: 'Hetauda-04, Main Road, Makwanpur, Nepal',
      });
    }
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    let settings = await SiteSettings.findOne();
    if (settings) {
      Object.assign(settings, body);
      await settings.save();
    } else {
      settings = await SiteSettings.create(body);
    }

    return NextResponse.json({ success: true, message: 'Settings saved', settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
