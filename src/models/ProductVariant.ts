import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductVariant extends Document {
  product: mongoose.Types.ObjectId;
  sku: string;
  size: string;
  color: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema: Schema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    sku: { type: String, required: true, unique: true, index: true, uppercase: true, trim: true },
    size: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

ProductVariantSchema.index({ product: 1, size: 1, color: 1 }, { unique: true });

const ProductVariant: Model<IProductVariant> =
  mongoose.models.ProductVariant || mongoose.model<IProductVariant>('ProductVariant', ProductVariantSchema);
export default ProductVariant;
