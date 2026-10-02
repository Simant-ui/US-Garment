import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'ORDER_UPDATE' | 'CUSTOM_ORDER' | 'WHOLESALE' | 'PROMO' | 'SYSTEM';
  title: string;
  message: string;
  relatedEntityType?: string;
  relatedEntityId?: mongoose.Types.ObjectId;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['ORDER_UPDATE', 'CUSTOM_ORDER', 'WHOLESALE', 'PROMO', 'SYSTEM'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedEntityType: { type: String },
    relatedEntityId: { type: Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;
