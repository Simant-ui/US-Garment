import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword } from '@/lib/auth';
import { verifyOtpSchema } from '@/validations/auth.schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = verifyOtpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, otp } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if pending registration exists
    const pending = await prisma.pendingUser.findUnique({ where: { email: normalizedEmail } });
    if (!pending) {
      return NextResponse.json(
        { success: false, error: 'No pending registration found for this email or session expired. Please sign up again.' },
        { status: 400 }
      );
    }

    // 2. Check max attempt limit (max 5 attempts)
    if ((pending.otpAttempts || 0) >= 5) {
      return NextResponse.json(
        { success: false, error: 'Too many failed verification attempts. Please click "Resend Code" to get a new code.' },
        { status: 400 }
      );
    }

    // 3. Check expiration
    const expiry = pending.otpExpiresAt || new Date(Date.now() + 10 * 60 * 1000);
    if (new Date() > new Date(expiry)) {
      return NextResponse.json(
        { success: false, error: 'This verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // 4. Verify OTP hash server-side
    const isValidOtp = await comparePassword(otp, pending.otpHash || '');
    if (!isValidOtp) {
      await prisma.pendingUser.update({
        where: { id: pending.id },
        data: { otpAttempts: (pending.otpAttempts || 0) + 1 },
      });

      return NextResponse.json(
        { success: false, error: 'Invalid verification code. Please try again.' },
        { status: 400 }
      );
    }

    // 5. Create or update final User account
    await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name: pending.name,
        password: pending.passwordHash,
        phone: pending.phone,
        isVerified: true,
        role: 'CUSTOMER',
      },
      create: {
        name: pending.name,
        email: normalizedEmail,
        password: pending.passwordHash,
        phone: pending.phone,
        role: 'CUSTOMER',
        isVerified: true,
      },
    });

    // 6. Delete pending registration to prevent OTP reuse
    await prisma.pendingUser.delete({ where: { id: pending.id } });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully. Your account has been created. Please login.',
    });
  } catch (error: any) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
