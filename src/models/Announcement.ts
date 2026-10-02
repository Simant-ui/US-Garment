import mongoose, { Schema, Document, Model } from 'mongoose';

export type AnnouncementType =
  | 'General Notice'
  | 'Holiday Notice'
  | 'Important Notice'
  | 'Offer / Promotion'
  | 'Delivery Update'
  | 'Maintenance'
  | 'Custom';

export type DisplayType = 'center_popup' | 'top_banner';
export type PopupStyle = 'standard' | 'important' | 'promotion' | 'minimal' | 'image_banner';
export type DisplayFrequency = 'every_visit' | 'once_session' | 'once_day' | 'once_only';
export type PriorityLevel = 'low' | 'normal' | 'high' | 'urgent';

export interface IAnnouncement extends Document {
  internalName: string;
  type: AnnouncementType;
  title: {
    en: string;
    ne: string;
  };
  subtitle?: {
    en: string;
    ne: string;
  };
  content?: {
    en: string;
    ne: string;
  };
  highlightText?: {
    en: string;
    ne: string;
  };
  image?: string;
  displayType: DisplayType;
  popupStyle: PopupStyle;
  primaryColor?: string;
  accentColor?: string;
  ctaEnabled: boolean;
  ctaText?: {
    en: string;
    ne: string;
  };
  ctaUrl?: string;
  allowDoNotShowAgain: boolean;
  displayFrequency: DisplayFrequency;
  priority: PriorityLevel;
  isActive: boolean;
  startAt: Date;
  endAt: Date;
  views: number;
  clicks: number;
  dismissals: number;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    internalName: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      default: 'General Notice',
    },
    title: {
      en: { type: String, required: true, default: '' },
      ne: { type: String, required: true, default: '' },
    },
    subtitle: {
      en: { type: String, default: '' },
      ne: { type: String, default: '' },
    },
    content: {
      en: { type: String, default: '' },
      ne: { type: String, default: '' },
    },
    highlightText: {
      en: { type: String, default: '' },
      ne: { type: String, default: '' },
    },
    image: { type: String, default: '' },
    displayType: {
      type: String,
      enum: ['center_popup', 'top_banner'],
      default: 'center_popup',
    },
    popupStyle: {
      type: String,
      enum: ['standard', 'important', 'promotion', 'minimal', 'image_banner'],
      default: 'important',
    },
    primaryColor: { type: String, default: '#0F4C3A' },
    accentColor: { type: String, default: '#9B111E' },
    ctaEnabled: { type: Boolean, default: true },
    ctaText: {
      en: { type: String, default: 'Shop Now' },
      ne: { type: String, default: 'अहिले किनमेल गर्नुहोस्' },
    },
    ctaUrl: { type: String, default: '/shop' },
    allowDoNotShowAgain: { type: Boolean, default: true },
    displayFrequency: {
      type: String,
      enum: ['every_visit', 'once_session', 'once_day', 'once_only'],
      default: 'once_session',
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    isActive: { type: Boolean, default: true, index: true },
    startAt: { type: Date, required: true, default: Date.now, index: true },
    endAt: { type: Date, required: true, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), index: true },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    dismissals: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

AnnouncementSchema.index({ isActive: 1, startAt: 1, endAt: 1, priority: 1 });

const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);

export default Announcement;
