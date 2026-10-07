import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (code) {
      const coupon = await prisma.coupon.findFirst({
        where: { code: code.toUpperCase(), isActive: true },
      });
      if (!coupon) {
        return NextResponse.json({ success: false, error: 'Invalid coupon code' }, { status: 404 });
      }
      return NextResponse.json({ success: true, coupon });
    }

    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin' }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin' }, { status: 401 });
    }

    const body = await req.json();
    const { _id, id, createdAt, updatedAt, expiryDate, ...couponData } = body;

    const coupon = await prisma.coupon.create({
      data: {
        ...couponData,
        code: couponData.code ? couponData.code.trim().toUpperCase() : '',
        discountValue: Number(couponData.discountValue || 0),
        minOrderAmount: Number(couponData.minOrderAmount || 0),
        ...(expiryDate ? { expiryDate: new Date(expiryDate) } : {}),
      },
    });
    return NextResponse.json({ success: true, message: 'Coupon created', coupon }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
