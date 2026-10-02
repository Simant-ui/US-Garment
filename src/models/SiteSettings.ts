import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
  businessName: string;
  tagline?: string;
  logo: string;
  favicon?: string;
  phone: string;
  secondaryPhone?: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  announcementBar: {
    enabled: boolean;
    text: string;
    bgColor?: string;
    textColor?: string;
  };
  shippingCharge: number;
  freeShippingThreshold: number;
  currency: string;
  taxPercentage: number;
  storeStatus: 'OPEN' | 'MAINTENANCE';
  footerAboutText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema(
  {
    businessName: { type: String, default: 'US Dresses and Garment Udyog' },
    tagline: { type: String, default: 'गुणस्तरीय पोशाक, विश्वास हाम्रो शान' },
    logo: { type: String, default: '/images/logo.png' },
    favicon: { type: String },
    phone: { type: String, default: '+977 9855012345' },
    secondaryPhone: { type: String, default: '+977 057 523456' },
    whatsapp: { type: String, default: '+9779855012345' },
    email: { type: String, default: 'info@usdresses.com.np' },
    address: { type: String, default: 'Hetauda-04, Main Road, Makwanpur, Nepal' },
    googleMapsUrl: { type: String, default: 'https://maps.google.com/?q=Hetauda+Garment' },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/usdresseshetauda' },
      instagram: { type: String, default: 'https://instagram.com/usdresses.nepal' },
      tiktok: { type: String, default: 'https://tiktok.com/@usdresses_official' },
      youtube: { type: String, default: 'https://youtube.com/@usdressesgarment' },
    },
    announcementBar: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: 'गुणस्तरीय उत्पादन, उचित मूल्य र समयमा डेलिभरी | School Uniform • House Dress • Ladies Wear' },
      bgColor: { type: String, default: '#0F4C3A' },
      textColor: { type: String, default: '#FFFFFF' },
    },
    shippingCharge: { type: Number, default: 150 },
    freeShippingThreshold: { type: Number, default: 3000 },
    currency: { type: String, default: 'NPR' },
    taxPercentage: { type: Number, default: 0 },
    storeStatus: { type: String, enum: ['OPEN', 'MAINTENANCE'], default: 'OPEN' },
    footerAboutText: { type: String, default: 'US Dresses and Garment Udyog is a premier garment manufacturer, wholesaler, retailer and custom stitching center based in Hetauda, Makwanpur, Nepal.' },
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
export default SiteSettings;
