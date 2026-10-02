import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVariant {
  sku: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  image?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  category: mongoose.Types.ObjectId | string;
  subCategory?: string;
  brand: string;
  images: string[];
  thumbnail: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  sizes: string[];
  colors: string[];
  variants: IVariant[];
  stock: number;
  tags: string[];
  material?: string;
  careInstructions?: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  seoTitle?: string;
  seoDescription?: string;
  ratingAverage?: number;
  ratingCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema({
  sku: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String },
});

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, index: true, uppercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    subCategory: { type: String },
    brand: { type: String, default: 'US Dresses & Garment Udyog' },
    images: [{ type: String, required: true }],
    thumbnail: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    discount: { type: Number, default: 0 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    variants: [VariantSchema],
    stock: { type: Number, required: true, default: 0 },
    tags: [{ type: String }],
    material: { type: String },
    careInstructions: { type: String },
    isFeatured: { type: Boolean, default: false, index: true },
    isNewArrival: { type: Boolean, default: false, index: true },
    isBestSeller: { type: Boolean, default: false, index: true },
    isOnSale: { type: Boolean, default: false },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'PUBLISHED', index: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    ratingAverage: { type: Number, default: 4.8 },
    ratingCount: { type: Number, default: 12 },
  },
  { timestamps: true }
);

// Compound indexes for fast search & filtering
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, status: 1, price: 1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
