import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'CUSTOMER';
  avatar?: string;
  isVerified: boolean;
  wishlist: mongoose.Types.ObjectId[];
  defaultAddress?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    role: { type: String, enum: ['CUSTOMER'], default: 'CUSTOMER' },
    avatar: { type: String },
    isVerified: { type: Boolean, default: true },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    defaultAddress: { type: Schema.Types.ObjectId, ref: 'Address' },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
