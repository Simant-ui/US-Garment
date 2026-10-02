import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICollection extends Document {
  title: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  featuredProducts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    featuredProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

const Collection: Model<ICollection> = mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);
export default Collection;
