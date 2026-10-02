import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';

export class CartService {
  static async getCart(userId: string) {
    await connectDB();
    let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price thumbnail slug');
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
  }

  static async addItem(userId: string, data: { productId: string; variantId?: string; quantity: number }) {
    await connectDB();
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === data.productId && item.variantId === data.variantId
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += data.quantity;
    } else {
      cart.items.push({
        product: data.productId as any,
        variantId: data.variantId || '',
        quantity: data.quantity,
      } as any);
    }

    await cart.save();
    return cart;
  }

  static async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    await connectDB();
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found.');

    const item = (cart.items as any).id ? (cart.items as any).id(itemId) : cart.items.find((i: any) => i._id?.toString() === itemId);
    if (item) {
      if (quantity <= 0) {
        if ((cart.items as any).pull) {
          (cart.items as any).pull(itemId);
        } else {
          cart.items = cart.items.filter((i: any) => i._id?.toString() !== itemId) as any;
        }
      } else {
        item.quantity = quantity;
      }
      await cart.save();
    }
    return cart;
  }

  static async removeItem(userId: string, itemId: string) {
    await connectDB();
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found.');

    if ((cart.items as any).pull) {
      (cart.items as any).pull(itemId);
    } else {
      cart.items = cart.items.filter((i: any) => i._id?.toString() !== itemId) as any;
    }

    await cart.save();
    return cart;
  }

  static async clearCart(userId: string) {
    await connectDB();
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [] as any;
      await cart.save();
    }
    return { message: 'Cart cleared.' };
  }
}
