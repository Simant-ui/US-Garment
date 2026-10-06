import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin' }, { status: 401 });
    }

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
      totalSalesAgg,
      todaySalesAgg,
      monthSalesAgg,
      recentOrders,
      recentCustomOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'Pending' } }),
      prisma.order.count({ where: { status: 'Delivered' } }),
      prisma.customOrder.count(),
      prisma.wholesaleInquiry.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count(),
      prisma.product.findMany({
        where: { stock: { lte: 5 } },
        select: { id: true, name: true, sku: true, stock: true, thumbnail: true, price: true },
        take: 5,
      }),
      prisma.order.aggregate({
        where: { status: { not: 'Cancelled' } },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: { status: { not: 'Cancelled' }, createdAt: { gte: todayStart } },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: { status: { not: 'Cancelled' }, createdAt: { gte: monthStart } },
        _sum: { totalAmount: true },
      }),
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.customOrder.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    const totalSales = totalSalesAgg._sum.totalAmount || 0;
    const todaySales = todaySalesAgg._sum.totalAmount || 0;
    const monthlySales = monthSalesAgg._sum.totalAmount || 0;

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
