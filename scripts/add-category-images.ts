import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const db = new PrismaClient();
const OUT_DIR = '/home/z/my-project/public/products';

// Category image generation prompts
const CATEGORY_PROMPTS: Record<string, string> = {
  'groceries': 'Professional product photography of Pakistani grocery items including flour bag, rice, sugar, lentils and spices arranged on a clean white surface, top-down flat lay style, bright lighting, high quality',
  'beverages': 'Professional product photography of beverage bottles including cola, pepsi, sprite, mineral water and energy drinks arranged neatly on white surface, studio lighting, high quality commercial photo',
  'snacks-chocolates': 'Professional product photography of snack items including chips packets, chocolate bars, biscuits and kurkure arranged on clean white surface, colorful packaging, bright studio lighting, high quality',
  'household': 'Professional product photography of household cleaning products including detergent, dish wash, toilet cleaner, floor cleaner and tissue rolls arranged on white surface, clean commercial style, high quality',
  'personal-care': 'Professional product photography of personal care items including shampoo bottle, toothpaste, soap bars and body lotion arranged on white surface, bathroom products, bright lighting, high quality',
  'dairy-fresh': 'Professional product photography of dairy products including milk carton, cheese block, butter, and yogurt cups arranged on white marble surface, fresh food photography, bright natural lighting, high quality',
};

async function generateCategoryImage(categorySlug: string, prompt: string): Promise<string | null> {
  const filename = `${categorySlug}.png`;
  const filepath = path.join(OUT_DIR, filename);

  if (fs.existsSync(filepath)) {
    console.log(`  EXISTS: ${filename}`);
    return `/products/${filename}`;
  }

  console.log(`  Generating: ${categorySlug}...`);
  try {
    execSync(
      `z-ai image -p "${prompt}" -o "${filepath}" -s 1024x1024`,
      { timeout: 120000, encoding: 'utf-8' }
    );
    console.log(`  DONE: ${filename}`);
    return `/products/${filename}`;
  } catch (err: any) {
    console.log(`  ERROR: ${err.message?.substring(0, 120) || err}`);
    return null;
  }
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const categories = await db.category.findMany({
    where: { isActive: true },
    include: { products: { where: { isActive: true } } },
  });

  console.log(`Found ${categories.length} categories\n`);

  for (const category of categories) {
    console.log(`Category: ${category.name} (${category.products.length} products)`);
    const prompt = CATEGORY_PROMPTS[category.slug];
    if (!prompt) {
      console.log('  SKIP: No prompt for this category\n');
      continue;
    }

    const imageUrl = await generateCategoryImage(category.slug, prompt);
    if (imageUrl) {
      // Update all products in this category
      const result = await db.product.updateMany({
        where: { categoryId: category.id },
        data: { image: imageUrl },
      });
      console.log(`  Updated ${result.count} products\n`);
    } else {
      console.log('  No image generated, skipping\n');
    }

    // Delay between generations
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('All done!');
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());