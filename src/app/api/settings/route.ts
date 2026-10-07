import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          businessName: 'US Dresses and Garment Udyog',
          logo: '/images/logo.png',
          phone: '+977 9855012345',
          whatsapp: '+9779855012345',
          email: 'info@usdresses.com.np',
          address: 'Hetauda-04, Main Road, Makwanpur, Nepal',
        },
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

    const body = await req.json();
    const { _id, id, createdAt, updatedAt, ...updateData } = body;

    let settings = await prisma.siteSettings.findFirst();
    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: updateData,
      });
    }

    return NextResponse.json({ success: true, message: 'Settings saved', settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
