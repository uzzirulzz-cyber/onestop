import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

  export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    // For dynamic route: if there's a slug-like path segment, use the product lookup
    const urlPath = new URL(req.url).pathname;
    const segments = urlPath.split('/').filter(Boolean);
    const possibleSlug = segments.length > 1 ? segments[segments.length - 1] : null;

    const where: Record<string, unknown> = { isActive: true };

    if (category && category !== 'all') {
      if (category.length > 20 || !category.includes('/')) {
        where.categoryId = category;
      } else {
        where.category = { slug: category };
      }
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    // If there's a possible slug in the URL (not just numbers), do a product lookup by slug
    if (possibleSlug && !/^\d+$/.test(possibleSlug)) {
      const product = await db.product.findFirst({
        where: { slug: possibleSlug, isActive: true },
      });
      if (product) {
        return NextResponse.json(product);
      }
    }

    const products = await db.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product = await db.product.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: body.description,
        price: parseFloat(body.price),
        compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
        sku: body.sku,
        barcode: body.barcode,
        stock: parseInt(body.stock) || 0,
        unit: body.unit || 'piece',
        image: body.image,
        images: body.images,
        categoryId: body.categoryId || null,
        isFeatured: body.isFeatured || false,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}