import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/mailer';
import { registerSchema } from '@/validations/auth.schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if email already belongs to an existing verified account
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists. Please log in.' },
        { status: 400 }
      );
    }

    // 2. Check 60s cooldown if a pending verification exists
    const existingPending = await prisma.pendingUser.findUnique({ where: { email: normalizedEmail } });
    if (existingPending) {
      const timeDiffSeconds = (Date.now() - new Date(existingPending.lastOtpSentAt || Date.now()).getTime()) / 1000;
      if (timeDiffSeconds < 60) {
        const remaining = Math.ceil(60 - timeDiffSeconds);
        return NextResponse.json(
          {
            success: false,
            error: `Please wait ${remaining} seconds before requesting a new verification code.`,
          },
          { status: 429 }
        );
      }
    }

    // 3. Generate 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Hash password & OTP securely
    const hashedPassword = await hashPassword(password);
    const otpHash = await hashPassword(otp);

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 5. Save or update PendingUser record
    await prisma.pendingUser.upsert({
      where: { email: normalizedEmail },
      update: {
        name,
        passwordHash: hashedPassword,
        phone: phone || '',
        otpHash,
        otpExpiresAt,
        otpAttempts: 0,
        lastOtpSentAt: new Date(),
      },
      create: {
        name,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        phone: phone || '',
        otpHash,
        otpExpiresAt,
        otpAttempts: 0,
        lastOtpSentAt: new Date(),
      },
    });

    // 6. Send OTP Email via Nodemailer
    const emailSent = await sendOtpEmail(normalizedEmail, name, otp);

    if (!emailSent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send verification code email. Please check your email address and try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email. Please verify to complete account registration.',
      email: normalizedEmail,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
