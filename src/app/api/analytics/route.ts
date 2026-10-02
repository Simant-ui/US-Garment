import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import CustomOrder from '@/models/CustomOrder';
import WholesaleInquiry from '@/models/WholesaleInquiry';
import { getAdminUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin' }, { status: 401 });
    }

    await connectDB();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      pendingOrders,
      deliveredOrders,
      customOrdersCount,
      wholesaleCount,
      customersCount,
      productsCount,
      lowStockProducts,
      salesData,
      todaySalesData,
      monthSalesData,
      recentOrders,
      recentCustomOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ status: 'Delivered' }),
      CustomOrder.countDocuments(),
      WholesaleInquiry.countDocuments(),
      User.countDocuments({ role: 'CUSTOMER' }),
      Product.countDocuments(),
      Product.find({ stock: { $lte: 5 } }).select('name sku stock thumbnail price').limit(5).lean(),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' }, createdAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' }, createdAt: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      CustomOrder.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const totalSales = salesData[0]?.total || 0;
    const todaySales = todaySalesData[0]?.total || 0;
    const monthlySales = monthSalesData[0]?.total || 0;

    return NextResponse.json({
      success: true,
      metrics: {
        totalSales,
        todaySales,
        monthlySales,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        customOrdersCount,
        wholesaleCount,
        customersCount,
        productsCount,
        lowStockCount: lowStockProducts.length,
      },
      lowStockProducts,
      recentOrders,
      recentCustomOrders,
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
