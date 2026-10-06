import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';
import { adminLoginSchema } from '@/validations/auth.schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = adminLoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = validation.data;
    const admin = await prisma.adminUser.findFirst({
      where: { email: email.toLowerCase(), isActive: true },
    });

    if (!admin) {
      return NextResponse.json({ success: false, error: 'Invalid admin credentials or inactive account' }, { status: 401 });
    }

    const isMatch = await comparePassword(password, admin.password || '');
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
    }

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    const token = signToken({
      userId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
      },
    });

    response.cookies.set('garment_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
