import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const db = new PrismaClient();

const IMAGE_QUERIES: Record<string, string> = {
  'flour-atta-10kg': 'wheat flour atta 10kg bag Pakistani grocery',
  'basmati-rice-5kg': 'basmati rice 5kg bag white rice',
  'sugar-5kg': 'white sugar 5kg bag grocery store',
  'cooking-oil-5l': 'cooking oil 5 liter bottle vegetable oil',
  'lentils-dal-2kg': 'lentils dal 2kg pack Indian grocery',
  'salt-1kg': 'table salt 1kg pack iodized salt',
  'red-chili-powder-200g': 'red chili powder spice pack',
  'turmeric-powder-200g': 'turmeric powder spice pack golden',
  'tea-tapal-danedar-950g': 'Tapal Danedar tea box Pakistani',
  'pepsi-1-5l': 'Pepsi 1.5 liter bottle cold drink',
  'coca-cola-1-5l': 'Coca Cola 1.5 liter bottle',
  'sprite-1-5l': 'Sprite 1.5 liter bottle green',
  'mineral-water-nestle-1-5l': 'Nestle mineral water 1.5 liter bottle',
  'red-bull-250ml': 'Red Bull energy drink 250ml can',
  'lays-classic-34g': 'Lays classic chips potato chips packet',
  'kurkure-62g': 'Kurkure spicy snack pack',
  'galaxy-chocolate-47g': 'Galaxy chocolate bar smooth',
  'snickers-50g': 'Snickers chocolate bar peanuts caramel',
  'biscuits-cocomo-104g': 'Cocomo chocolate biscuits pack',
  'surf-excel-1kg': 'Surf Excel washing powder 1kg pack',
  'vim-dish-wash-500ml': 'Vim dish wash liquid 500ml bottle',
  'harpic-500ml': 'Harpic toilet cleaner 500ml bottle',
  'floor-cleaner-1l': 'floor cleaner liquid 1 liter bottle',
  'tissue-roll-4pcs': 'toilet tissue roll 4 pack paper',
  'head-shoulders-shampoo-340ml': 'Head and Shoulders shampoo 340ml bottle',
  'colgate-maxfresh-150g': 'Colgate MaxFresh toothpaste 150g tube',
  'lifebuoy-soap-4pcs': 'Lifebuoy soap 4 pieces pack antibacterial',
  'nivea-body-lotion-400ml': 'Nivea body lotion 400ml bottle',
  'olpers-milk-1l': 'Olpers milk 1 liter pack UHT',
  'cheddar-cheese-200g': 'cheddar cheese 200g block yellow',
  'yogurt-doogh-1l': 'yogurt doogh drink 1 liter bottle',
  'butter-200g': 'butter 200g block yellow dairy',
};

const PRODUCT_SLUG_TO_QUERY: Record<string, string> = {
  'flour-atta-10kg': 'flour-atta-10kg',
  'basmati-rice-5kg': 'basmati-rice-5kg',
  'sugar-5kg': 'sugar-5kg',
  'cooking-oil-5l': 'cooking-oil-5l',
  'lentils-dal-2kg': 'lentils-dal-2kg',
  'salt-1kg': 'salt-1kg',
  'red-chili-powder-200g': 'red-chili-powder-200g',
  'turmeric-powder-200g': 'turmeric-powder-200g',
  'tea-tapal-danedar-950g': 'tea-tapal-danedar-950g',
  'pepsi-1-5l': 'pepsi-1-5l',
  'coca-cola-1-5l': 'coca-cola-1-5l',
  'sprite-1-5l': 'sprite-1-5l',
  'mineral-water-nestle-1-5l': 'mineral-water-nestle-1-5l',
  'red-bull-250ml': 'red-bull-250ml',
  'lays-classic-34g': 'lays-classic-34g',
  'kurkure-62g': 'kurkure-62g',
  'galaxy-chocolate-47g': 'galaxy-chocolate-47g',
  'snickers-50g': 'snickers-50g',
  'biscuits-cocomo-104g': 'biscuits-cocomo-104g',
  'surf-excel-1kg': 'surf-excel-1kg',
  'vim-dish-wash-500ml': 'vim-dish-wash-500ml',
  'harpic-500ml': 'harpic-500ml',
  'floor-cleaner-1l': 'floor-cleaner-1l',
  'tissue-roll-4pcs': 'tissue-roll-4pcs',
  'head-shoulders-shampoo-340ml': 'head-shoulders-shampoo-340ml',
  'colgate-maxfresh-150g': 'colgate-maxfresh-150g',
  'lifebuoy-soap-4pcs': 'lifebuoy-soap-4pcs',
  'nivea-body-lotion-400ml': 'nivea-body-lotion-400ml',
  'olpers-milk-1l': 'olpers-milk-1l',
  'cheddar-cheese-200g': 'cheddar-cheese-200g',
  'yogurt-doogh-1l': 'yogurt-doogh-1l',
  'butter-200g': 'butter-200g',
};

async function main() {
  const products = await db.product.findMany();
  console.log(`Found ${products.length} products`);

  const imageMap: Record<string, string> = {};

  for (const product of products) {
    const queryKey = PRODUCT_SLUG_TO_QUERY[product.slug];
    if (!queryKey) {
      console.log(`SKIP (no query): ${product.slug}`);
      continue;
    }

    if (imageMap[queryKey]) {
      // Reuse same query result for same query
      await db.product.update({ where: { id: product.id }, data: { image: imageMap[queryKey] } });
      console.log(`REUSE: ${product.slug} -> ${imageMap[queryKey].substring(0, 60)}...`);
      continue;
    }

    const query = IMAGE_QUERIES[queryKey];
    console.log(`Searching: ${product.slug} -> "${query}"`);

    try {
      const result = execSync(
        `z-ai image-search -q "${query}" -c 1 --no-rank --gl us`,
        { timeout: 120000, encoding: 'utf-8', cwd: '/home/z/my-project' }
      );

      const data = JSON.parse(result);
      if (data.success && data.results && data.results.length > 0) {
        const url = data.results[0].original_url;
        imageMap[queryKey] = url;
        await db.product.update({ where: { id: product.id }, data: { image: url } });
        console.log(`  OK: ${url.substring(0, 80)}...`);
      } else {
        console.log(`  EMPTY result`);
      }
    } catch (err: any) {
      console.log(`  ERROR: ${err.message?.substring(0, 100) || err}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\nDone! Images added to products.');
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());