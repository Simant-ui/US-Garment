import mongoose, { Schema, Document, Model } from 'mongoose';

export interface BilingualText {
  en: string;
  ne: string;
}

export interface ICategory extends Document {
  name: BilingualText | string;
  slug: string;
  description?: BilingualText | string;
  image?: string;
  icon?: string;
  parentCategory?: mongoose.Types.ObjectId | null;
  isActive: boolean;
  sortOrder: number;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: Schema.Types.Mixed,
      required: true,
    },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    description: { type: Schema.Types.Mixed },
    image: { type: String, default: '' },
    icon: { type: String, default: '' },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ isActive: 1, sortOrder: 1, orderIndex: 1 });

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
