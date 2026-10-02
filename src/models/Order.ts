import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  total: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  guestCustomer?: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    city: string;
    addressLine: string;
    landmark?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  couponCode?: string;
  paymentMethod: 'COD' | 'BANK_TRANSFER' | 'ONLINE_GATEWAY' | 'ESewa' | 'Khalti';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentDetails?: {
    transactionId?: string;
    paymentDate?: Date;
    receiptImage?: string;
  };
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  statusHistory: Array<{
    status: string;
    updatedBy: string;
    comment?: string;
    timestamp: Date;
  }>;
  orderNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    guestCustomer: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      addressLine: { type: String, required: true },
      landmark: { type: String },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    couponCode: { type: String },
    paymentMethod: {
      type: String,
      enum: ['COD', 'BANK_TRANSFER', 'ONLINE_GATEWAY', 'ESewa', 'Khalti'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    paymentDetails: {
      transactionId: { type: String },
      paymentDate: { type: Date },
      receiptImage: { type: String },
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
      default: 'Pending',
      index: true,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        updatedBy: { type: String, required: true },
        comment: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    orderNotes: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
