import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await db.orderItem.deleteMany();
    await db.order.deleteMany();
    await db.product.deleteMany();
    await db.category.deleteMany();

    const groceries = await db.category.create({
      data: { name: 'Groceries', slug: 'groceries', description: 'Daily essential grocery items', sortOrder: 1 },
    });
    const beverages = await db.category.create({
      data: { name: 'Beverages', slug: 'beverages', description: 'Drinks and beverages', sortOrder: 2 },
    });
    const snacks = await db.category.create({
      data: { name: 'Snacks & Chocolates', slug: 'snacks-chocolates', description: 'Snacks, chips, and chocolates', sortOrder: 3 },
    });
    const household = await db.category.create({
      data: { name: 'Household', slug: 'household', description: 'Household cleaning and supplies', sortOrder: 4 },
    });
    const personalCare = await db.category.create({
      data: { name: 'Personal Care', slug: 'personal-care', description: 'Personal hygiene and care products', sortOrder: 5 },
    });
    const dairy = await db.category.create({
      data: { name: 'Dairy & Fresh', slug: 'dairy-fresh', description: 'Dairy products and fresh items', sortOrder: 6 },
    });

    const products = [
      { name: 'Flour (Atta) 10kg', price: 1850, stock: 50, categoryId: groceries.id, isFeatured: true, unit: 'bag' },
      { name: 'Basmati Rice 5kg', price: 1200, stock: 40, categoryId: groceries.id, isFeatured: true, unit: 'bag' },
      { name: 'Sugar 5kg', price: 850, stock: 60, categoryId: groceries.id, unit: 'bag' },
      { name: 'Cooking Oil 5L', price: 3200, stock: 35, categoryId: groceries.id, isFeatured: true, unit: 'bottle' },
      { name: 'Lentils (Dal) 2kg', price: 600, stock: 45, categoryId: groceries.id, unit: 'pack' },
      { name: 'Salt 1kg', price: 80, stock: 100, categoryId: groceries.id, unit: 'pack' },
      { name: 'Red Chili Powder 200g', price: 250, stock: 70, categoryId: groceries.id, unit: 'pack' },
      { name: 'Turmeric Powder 200g', price: 220, stock: 65, categoryId: groceries.id, unit: 'pack' },
      { name: 'Tea (Tapal Danedar) 950g', price: 1350, stock: 30, categoryId: groceries.id, isFeatured: true, unit: 'pack' },
      { name: 'Pepsi 1.5L', price: 250, stock: 80, categoryId: beverages.id, unit: 'bottle' },
      { name: 'Coca-Cola 1.5L', price: 260, stock: 75, categoryId: beverages.id, unit: 'bottle' },
      { name: 'Sprite 1.5L', price: 250, stock: 60, categoryId: beverages.id, unit: 'bottle' },
      { name: 'Mineral Water (Nestle) 1.5L', price: 120, stock: 100, categoryId: beverages.id, unit: 'bottle' },
      { name: 'Red Bull 250ml', price: 550, stock: 40, categoryId: beverages.id, unit: 'can' },
      { name: 'Lays Classic 34g', price: 60, stock: 120, categoryId: snacks.id, unit: 'pack' },
      { name: 'Kurkure 62g', price: 70, stock: 100, categoryId: snacks.id, unit: 'pack' },
      { name: 'Galaxy Chocolate 47g', price: 180, stock: 80, categoryId: snacks.id, unit: 'bar' },
      { name: 'Snickers 50g', price: 150, stock: 70, categoryId: snacks.id, unit: 'bar' },
      { name: 'Biscuits (Cocomo) 104g', price: 120, stock: 90, categoryId: snacks.id, isFeatured: true, unit: 'pack' },
      { name: 'Surf Excel 1kg', price: 450, stock: 50, categoryId: household.id, unit: 'pack' },
      { name: 'Vim Dish Wash 500ml', price: 180, stock: 60, categoryId: household.id, unit: 'bottle' },
      { name: 'Harpic 500ml', price: 250, stock: 45, categoryId: household.id, unit: 'bottle' },
      { name: 'Floor Cleaner 1L', price: 320, stock: 40, categoryId: household.id, unit: 'bottle' },
      { name: 'Tissue Roll (4pcs)', price: 350, stock: 55, categoryId: household.id, unit: 'pack' },
      { name: 'Head & Shoulders Shampoo 340ml', price: 550, stock: 35, categoryId: personalCare.id, unit: 'bottle' },
      { name: 'Colgate MaxFresh 150g', price: 280, stock: 50, categoryId: personalCare.id, unit: 'tube' },
      { name: 'Lifebuoy Soap 4pcs', price: 320, stock: 60, categoryId: personalCare.id, unit: 'pack' },
      { name: 'Nivea Body Lotion 400ml', price: 850, stock: 25, categoryId: personalCare.id, unit: 'bottle' },
      { name: 'Olpers Milk 1L', price: 220, stock: 40, categoryId: dairy.id, unit: 'pack' },
      { name: 'Cheddar Cheese 200g', price: 450, stock: 20, categoryId: dairy.id, unit: 'pack' },
      { name: 'Yogurt (Doogh) 1L', price: 180, stock: 30, categoryId: dairy.id, unit: 'pack' },
      { name: 'Butter 200g', price: 380, stock: 25, categoryId: dairy.id, unit: 'pack' },
    ];

    for (const p of products) {
      await db.product.create({
        data: {
          name: p.name,
          slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          price: p.price,
          compareAtPrice: Math.round(p.price * 1.15),
          stock: p.stock,
          unit: p.unit,
          categoryId: p.categoryId,
          isFeatured: p.isFeatured,
          isActive: true,
        },
      });
    }

    const sampleOrders = [
      { name: 'Ahmed Khan', phone: '0300-1234567', status: 'completed', total: 4250 },
      { name: 'Fatima Bibi', phone: '0312-9876543', status: 'pending', total: 2100 },
      { name: 'Muhammad Ali', phone: '0333-5556677', status: 'processing', total: 5600 },
      { name: 'Sana Rafiq', phone: '0345-1112233', status: 'completed', total: 1850 },
      { name: 'Bilal Hussain', phone: '0355-4445566', status: 'pending', total: 3200 },
    ];

    for (const o of sampleOrders) {
      await db.order.create({
        data: {
          orderNumber: 'OSC-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          customerName: o.name,
          customerPhone: o.phone,
          status: o.status,
          subtotal: o.total,
          total: o.total,
        },
      });
    }

    return NextResponse.json({ message: 'Database seeded successfully', categories: 6, products: products.length, orders: sampleOrders.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}