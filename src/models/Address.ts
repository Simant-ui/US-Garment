import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  city: string;
  addressLine: string;
  landmark?: string;
  isDefault: boolean;
  type: 'HOME' | 'WORK' | 'OTHER';
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    addressLine: { type: String, required: true },
    landmark: { type: String },
    isDefault: { type: Boolean, default: false },
    type: { type: String, enum: ['HOME', 'WORK', 'OTHER'], default: 'HOME' },
  },
  { timestamps: true }
);

const Address: Model<IAddress> = mongoose.models.Address || mongoose.model<IAddress>('Address', AddressSchema);
export default Address;
