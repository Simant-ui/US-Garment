import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHomepageSection extends Document {
  sectionKey: string; // hero, category_grid, featured_products, school_uniform, ladies_collection, sportswear, wholesale_cta, custom_stitching_cta, promo_banner
  title: string;
  subtitle?: string;
  content?: string;
  heroImages?: string[];
  bannerImage?: string;
  buttonText?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  isEnabled: boolean;
  orderIndex: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const HomepageSectionSchema: Schema = new Schema(
  {
    sectionKey: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    content: { type: String },
    heroImages: [{ type: String }],
    bannerImage: { type: String },
    buttonText: { type: String },
    buttonUrl: { type: String },
    secondaryButtonText: { type: String },
    secondaryButtonUrl: { type: String },
    isEnabled: { type: Boolean, default: true },
    orderIndex: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const HomepageSection: Model<IHomepageSection> = mongoose.models.HomepageSection || mongoose.model<IHomepageSection>('HomepageSection', HomepageSectionSchema);
export default HomepageSection;
