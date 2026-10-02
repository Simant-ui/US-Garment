import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPendingUser extends Document {
  name: string;
  email: string;
  password?: string;
  passwordHash?: string;
  phone?: string;
  otp?: string;
  otpHash?: string;
  expiresAt?: Date;
  otpExpiresAt?: Date;
  otpAttempts?: number;
  lastOtpSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PendingUserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String },
    passwordHash: { type: String },
    phone: { type: String, trim: true },
    otp: { type: String },
    otpHash: { type: String },
    expiresAt: { type: Date },
    otpExpiresAt: { type: Date },
    otpAttempts: { type: Number, default: 0 },
    lastOtpSentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

PendingUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const PendingUser: Model<IPendingUser> =
  mongoose.models.PendingUser || mongoose.model<IPendingUser>('PendingUser', PendingUserSchema);

export default PendingUser;
