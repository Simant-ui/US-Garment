import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || SMTP_PORT === 465;
const SMTP_USER = process.env.SMTP_USER || 'noreply2082@gmail.com';
const SMTP_APP_PASSWORD = process.env.SMTP_APP_PASSWORD || '';

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_APP_PASSWORD,
  },
});

export async function sendMail(options: { to: string; subject: string; html: string; text?: string }): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"US Dresses & Garment Udyog" <${SMTP_USER}>`,
      replyTo: SMTP_USER,
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: options.html,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send email via SMTP:', error);
    return false;
  }
}

export async function sendOtpEmail(toEmail: string, customerName: string, otp: string): Promise<boolean> {
  return sendMail({
    to: toEmail,
    subject: 'Verify Your Email | US Dresses & Garment Udyog',
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #064E3B; padding: 28px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 22px; font-weight: bold; margin: 0; font-family: Georgia, serif;">US Dresses & Garment Udyog</h1>
          <p style="color: #10D990; font-size: 12px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Hetauda, Makwanpur, Nepal</p>
        </div>
        <div style="padding: 32px 28px;">
          <h2 style="color: #0F172A; font-size: 18px; font-weight: bold; margin-top: 0; margin-bottom: 16px;">Email Verification</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">Hello <strong>${customerName}</strong>,</p>
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">Thank you for creating an account with US Dresses & Garment Udyog.</p>
          
          <p style="color: #475569; font-size: 13px; font-weight: 600; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">Your verification code is:</p>
          <div style="text-align: center; margin: 20px 0 28px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #064E3B; background-color: #ECFDF5; padding: 14px 28px; border-radius: 12px; border: 2px dashed #10B981; display: inline-block;">${otp}</span>
          </div>

          <p style="color: #64748B; font-size: 13px; line-height: 1.5; margin: 0 0 8px 0;">This code will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #94A3B8; font-size: 12px; line-height: 1.5; margin: 0;">If you did not request this account, you can safely ignore this email.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #e2e8f0;">
          US Dresses & Garment Udyog • Hetauda, Nepal
        </div>
      </div>
    `,
  });
}
