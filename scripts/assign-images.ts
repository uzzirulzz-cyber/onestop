import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'groceries': '/products/groceries.png',
  'beverages': '/products/beverages.png',
  'snacks-chocolates': '/products/snacks-chocolates.png',
  'household': '/products/household.png',
  'personal-care': '/products/personal-care.png',
  'dairy-fresh': '/products/dairy-fresh.png',
};

async function main() {
  const categories = await db.category.findMany({
    where: { isActive: true },
  });

  let totalUpdated = 0;

  for (const category of categories) {
    const imageUrl = CATEGORY_IMAGE_MAP[category.slug];
    if (!imageUrl) continue;

    const result = await db.product.updateMany({
      where: { categoryId: category.id },
      data: { image: imageUrl },
    });

    totalUpdated += result.count;
    console.log(`${category.name}: updated ${result.count} products`);
  }

  console.log(`\nTotal: ${totalUpdated} products updated with images`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());