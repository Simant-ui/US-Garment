import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  paymentMethod: 'COD' | 'BANK_TRANSFER' | 'ONLINE_GATEWAY' | 'ESewa' | 'Khalti';
  provider: string;
  transactionId?: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED';
  providerReference?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    paymentMethod: {
      type: String,
      enum: ['COD', 'BANK_TRANSFER', 'ONLINE_GATEWAY', 'ESewa', 'Khalti'],
      required: true,
    },
    provider: { type: String, default: 'COD' },
    transactionId: { type: String },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'NPR' },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    providerReference: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
