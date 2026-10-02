import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import AdminUser from '@/models/AdminUser';
import { hashPassword, comparePassword, signToken, TokenPayload } from '@/lib/auth';
import { sendMail } from '@/lib/mailer';

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export class AuthService {
  static async registerUser(data: { name: string; email: string; password: string; phone?: string }) {
    await connectDB();
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw new Error('An account with this email address already exists.');
    }

    const hashedPassword = await hashPassword(data.password);
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await PendingUser.findOneAndDelete({ email: data.email.toLowerCase() });
    await PendingUser.create({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || '',
      password: hashedPassword,
      passwordHash: hashedPassword,
      otp,
      otpHash: otp,
      expiresAt,
      otpExpiresAt: expiresAt,
    });

    try {
      await sendMail({
        to: data.email,
        subject: `Verification Code: ${otp} - US Dresses & Garment Udyog`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #0F4C3A; text-align: center;">US Dresses & Garment Udyog</h2>
            <p>Namaste <strong>${data.name}</strong>,</p>
            <p>Thank you for registering. Your 6-digit verification code is:</p>
            <div style="background: #E6F4EE; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0F4C3A;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 12px;">This code will expire in 10 minutes.</p>
          </div>
        `,
      });
    } catch (e) {
      console.warn('Failed to send verification email:', e);
    }

    return { email: data.email, message: 'Verification code sent to your email.' };
  }

  static async verifyEmail(email: string, otp: string) {
    await connectDB();
    const pending = await PendingUser.findOne({ email: email.toLowerCase() });
    if (!pending) {
      throw new Error('Verification record not found or expired. Please register again.');
    }

    const currentOtp = pending.otp || pending.otpHash;
    const currentExpiry = pending.expiresAt || pending.otpExpiresAt;

    if (currentOtp !== otp || (currentExpiry && new Date() > new Date(currentExpiry))) {
      throw new Error('Invalid or expired verification code.');
    }

    const newUser = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password || pending.passwordHash,
      phone: pending.phone,
      role: 'CUSTOMER',
      isVerified: true,
    });

    await PendingUser.deleteOne({ _id: pending._id });

    const payload: TokenPayload = {
      userId: (newUser._id as any).toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };
    const token = signToken(payload);

    return { user: payload, token };
  }

  static async resendOtp(email: string) {
    await connectDB();
    const pending = await PendingUser.findOne({ email: email.toLowerCase() });
    if (!pending) {
      throw new Error('No pending registration found for this email.');
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    pending.otp = otp;
    pending.otpHash = otp;
    pending.expiresAt = expiresAt;
    pending.otpExpiresAt = expiresAt;
    await pending.save();

    await sendMail({
      to: email,
      subject: `Resent Verification Code: ${otp} - US Dresses`,
      html: `<p>Your new verification code is: <strong>${otp}</strong></p>`,
    });

    return { message: 'A new verification code has been sent.' };
  }

  static async loginUser(email: string, password: string) {
    await connectDB();
    let account: any = await User.findOne({ email: email.toLowerCase() });
    let isAdmin = false;

    if (!account) {
      const admin = await AdminUser.findOne({ email: email.toLowerCase() });
      if (admin) {
        account = admin;
        isAdmin = true;
      }
    }

    if (!account) {
      throw new Error('Invalid email or password.');
    }

    const userPassword = account.password || account.passwordHash;
    const match = await comparePassword(password, userPassword);
    if (!match) {
      throw new Error('Invalid email or password.');
    }

    const payload: TokenPayload = {
      userId: account._id.toString(),
      email: account.email,
      name: account.name,
      role: account.role || (isAdmin ? 'ADMIN' : 'CUSTOMER'),
    };
    const token = signToken(payload);

    return { user: payload, token };
  }

  static async forgotPassword(email: string) {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return { message: 'If an account exists, a reset link was sent.' };
    }
    const resetToken = signToken({ userId: (user._id as any).toString(), email: user.email, name: user.name, role: user.role }, '1h');
    return { message: 'Password reset link sent.', resetToken };
  }

  static async resetPassword(token: string, newPassword: string) {
    await connectDB();
    const payload = await import('@/lib/auth').then((m) => m.verifyToken(token));
    if (!payload) {
      throw new Error('Invalid or expired reset token.');
    }
    const hashedPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(payload.userId, { password: hashedPassword });
    return { message: 'Password reset successfully.' };
  }
}
