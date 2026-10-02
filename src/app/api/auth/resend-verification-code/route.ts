import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PendingUser from '@/models/PendingUser';
import { hashPassword } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/mailer';
import { resendOtpSchema } from '@/validations/auth.schema';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const validation = resendOtpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();

    const pending = await PendingUser.findOne({ email: normalizedEmail });
    if (!pending) {
      // Safe generic response to prevent account enumeration
      return NextResponse.json({
        success: true,
        message: 'If a pending registration exists for this email, a new verification code has been sent.',
      });
    }

    // 60-second cooldown check
    const timeDiffSeconds = (Date.now() - new Date(pending.lastOtpSentAt || Date.now()).getTime()) / 1000;
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

    // Generate NEW OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtpHash = await hashPassword(newOtp);
    const newExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    pending.otpHash = newOtpHash;
    pending.otpExpiresAt = newExpiresAt;
    pending.otpAttempts = 0;
    pending.lastOtpSentAt = new Date();
    await pending.save();

    // Send Email
    const sent = await sendOtpEmail(normalizedEmail, pending.name, newOtp);
    if (!sent) {
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'A new 6-digit verification code has been sent to your email.',
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
