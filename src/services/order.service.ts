import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';

export class OrderService {
  static async createOrder(data: {
    items: any[];
    shippingAddress: any;
    paymentMethod: string;
    couponCode?: string;
    orderNotes?: string;
    userId?: string;
  }) {
    await connectDB();
    if (!data.items || data.items.length === 0) {
      throw new Error('Order must contain at least one garment item.');
    }

    let itemsSubtotal = 0;
    const orderItems = [];

    for (const item of data.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.name}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }

      const itemTotal = product.price * item.quantity;
      itemsSubtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku || 'SKU-GENERIC',
        image: item.image || product.thumbnail,
        price: product.price,
        size: item.size || 'Standard',
        color: item.color || 'Standard',
        quantity: item.quantity,
        total: itemTotal,
      });

      // Reduce product stock
      product.stock -= item.quantity;
      await product.save();
    }

    let discountAmount = 0;
    if (data.couponCode) {
      const coupon = await Coupon.findOne({ code: data.couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (itemsSubtotal * coupon.discountValue) / 100;
        } else {
          discountAmount = coupon.discountValue;
        }
      }
    }

    const shippingFee = itemsSubtotal >= 3000 ? 0 : 150;
    const totalAmount = Math.max(0, itemsSubtotal - discountAmount + shippingFee);

    const count = await Order.countDocuments();
    const orderNumber = `USD-${1000 + count + 1}`;

    const order = await Order.create({
      orderNumber,
      user: data.userId ? (data.userId as any) : undefined,
      items: orderItems,
      shippingAddress: data.shippingAddress,
      paymentMethod: (data.paymentMethod || 'COD') as any,
      paymentStatus: 'PENDING',
      status: 'Pending',
      subtotal: itemsSubtotal,
      discount: discountAmount,
      shippingFee,
      totalAmount,
      couponCode: data.couponCode || '',
      orderNotes: data.orderNotes || '',
    });

    return order;
  }

  static async getMyOrders(userId: string) {
    await connectDB();
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
    return orders;
  }

  static async getOrderById(id: string, userId?: string, isAdmin: boolean = false) {
    await connectDB();
    const order = await Order.findById(id).lean();
    if (!order) throw new Error('Order not found.');
    if (!isAdmin && userId && order.user?.toString() !== userId) {
      throw new Error('Access denied to this order.');
    }
    return order;
  }

  static async getAllOrders(params: any) {
    await connectDB();
    const page = parseInt(params.page || '1');
    const limit = parseInt(params.limit || '20');
    const skip = (page - 1) * limit;

    const query: any = {};
    if (params.status) query.status = params.status;
    if (params.paymentStatus) query.paymentStatus = params.paymentStatus;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  static async updateOrderStatus(id: string, status: string) {
    await connectDB();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) throw new Error('Order not found.');
    return order;
  }

  static async updatePaymentStatus(id: string, paymentStatus: string) {
    await connectDB();
    const order = await Order.findByIdAndUpdate(id, { paymentStatus }, { new: true });
    if (!order) throw new Error('Order not found.');
    return order;
  }

  static async cancelOrder(id: string, userId?: string, isAdmin: boolean = false) {
    await connectDB();
    const order = await Order.findById(id);
    if (!order) throw new Error('Order not found.');
    if (!isAdmin && userId && order.user?.toString() !== userId) {
      throw new Error('Access denied.');
    }
    order.status = 'Cancelled';
    await order.save();
    return order;
  }
}
