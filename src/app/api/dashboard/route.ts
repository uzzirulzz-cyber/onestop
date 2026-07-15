import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const totalProducts = await db.product.count();
    const totalOrders = await db.order.count();
    const totalCategories = await db.category.count();

    const pendingOrders = await db.order.count({ where: { status: 'pending' } });
    const completedOrders = await db.order.count({ where: { status: 'completed' } });
    const totalRevenue = await db.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['completed', 'delivered'] } },
    });

    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    const lowStockProducts = await db.product.findMany({
      where: { stock: { lte: 10 }, isActive: true },
      take: 10,
      orderBy: { stock: 'asc' },
    });

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalCategories,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}