import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWholesaleInquiry extends Document {
  inquiryNumber: string;
  organizationName: string;
  contactPerson: string;
  phone: string;
  email: string;
  productType: string;
  estimatedQuantity: number;
  budgetRange?: string;
  requiredDate?: Date;
  location: string;
  description: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Negotiation' | 'Confirmed' | 'Production' | 'Completed' | 'Cancelled';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WholesaleInquirySchema: Schema = new Schema(
  {
    inquiryNumber: { type: String, required: true, unique: true, index: true },
    organizationName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    productType: { type: String, required: true },
    estimatedQuantity: { type: Number, required: true },
    budgetRange: { type: String },
    requiredDate: { type: Date },
    location: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Quoted', 'Negotiation', 'Confirmed', 'Production', 'Completed', 'Cancelled'],
      default: 'New',
      index: true,
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

WholesaleInquirySchema.index({ createdAt: -1 });

const WholesaleInquiry: Model<IWholesaleInquiry> = mongoose.models.WholesaleInquiry || mongoose.model<IWholesaleInquiry>('WholesaleInquiry', WholesaleInquirySchema);
export default WholesaleInquiry;
