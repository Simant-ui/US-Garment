import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomOrder extends Document {
  requestNumber: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  garmentType: string; // School uniform, House dress, T-shirt, Track suit, Ladies dress, Custom uniform, Bulk garment
  quantity: number;
  size?: string;
  color?: string;
  fabricPreference?: string;
  designRequirement: string;
  deliveryLocation: string;
  requiredDate?: Date;
  additionalMessage?: string;
  referenceImages: string[];
  status: 'New' | 'Contacted' | 'Quotation Sent' | 'Confirmed' | 'Production' | 'Completed' | 'Cancelled';
  adminNotes?: string;
  quotationAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomOrderSchema: Schema = new Schema(
  {
    requestNumber: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    garmentType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String },
    color: { type: String },
    fabricPreference: { type: String },
    designRequirement: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    requiredDate: { type: Date },
    additionalMessage: { type: String },
    referenceImages: [{ type: String }],
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Quotation Sent', 'Confirmed', 'Production', 'Completed', 'Cancelled'],
      default: 'New',
      index: true,
    },
    adminNotes: { type: String },
    quotationAmount: { type: Number },
  },
  { timestamps: true }
);

CustomOrderSchema.index({ createdAt: -1 });

const CustomOrder: Model<ICustomOrder> = mongoose.models.CustomOrder || mongoose.model<ICustomOrder>('CustomOrder', CustomOrderSchema);
export default CustomOrder;
