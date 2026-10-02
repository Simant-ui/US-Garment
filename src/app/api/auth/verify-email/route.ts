import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import { comparePassword } from '@/lib/auth';
import { verifyOtpSchema } from '@/validations/auth.schema';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
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
    const pending = await PendingUser.findOne({ email: normalizedEmail });
    if (!pending) {
      return NextResponse.json(
        { success: false, error: 'No pending registration found for this email or session expired. Please sign up again.' },
        { status: 400 }
      );
    }

    // 2. Check max attempt limit (e.g. max 5 attempts)
    if ((pending.otpAttempts || 0) >= 5) {
      return NextResponse.json(
        { success: false, error: 'Too many failed verification attempts. Please click "Resend Code" to get a new code.' },
        { status: 400 }
      );
    }

    // 3. Check expiration
    const expiry = pending.otpExpiresAt || pending.expiresAt || new Date(Date.now() + 10 * 60 * 1000);
    if (new Date() > new Date(expiry)) {
      return NextResponse.json(
        { success: false, error: 'This verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // 4. Verify OTP hash server-side
    const otpToCompare = pending.otpHash || pending.otp || '';
    const isValidOtp = await comparePassword(otp, otpToCompare);
    if (!isValidOtp) {
      pending.otpAttempts = (pending.otpAttempts || 0) + 1;
      await pending.save();

      return NextResponse.json(
        { success: false, error: 'Invalid verification code. Please try again.' },
        { status: 400 }
      );
    }

    // 5. Create final User account
    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      user.name = pending.name;
      user.password = pending.passwordHash;
      user.phone = pending.phone;
      user.isVerified = true;
      user.role = 'CUSTOMER';
      await user.save();
    } else {
      user = await User.create({
        name: pending.name,
        email: normalizedEmail,
        password: pending.passwordHash,
        phone: pending.phone,
        role: 'CUSTOMER',
        isVerified: true,
      });
    }

    // 6. Delete pending registration to prevent OTP reuse
    await PendingUser.deleteOne({ _id: pending._id });

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
