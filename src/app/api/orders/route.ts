import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const orders = await db.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderNumber = 'OSC-' + Date.now().toString(36).toUpperCase();

    const items = body.items as Array<{
      productId: string;
      productName: string;
      productPrice: number;
      quantity: number;
    }>;

    const subtotal = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
    const total = subtotal;

    const order = await db.order.create({
      data: {
        orderNumber,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail || null,
        status: 'pending',
        subtotal,
        total,
        notes: body.notes || null,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            quantity: item.quantity,
            unitPrice: item.productPrice,
          })),
        },
      },
      include: { items: true },
    });

    // Update stock
    for (const item of items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}