import { addProduct } from "@anawiser/backend";
import { simulateScrapeAndExtract } from "./src/engine";

async function main() {
  console.log("Seeding Database...");

  const urls = [
    "https://www.bestbuy.com/site/sony-playstation-5-console-white/6426149.p?skuId=6426149", // PS5
    "https://www.bestbuy.com/site/microsoft-xbox-series-x-1tb-console-black/6428324.p?skuId=6428324", // Xbox Series X
    "https://www.bestbuy.com/site/nintendo-switch-32gb-console-neon-red-neon-blue-joy-con/6371859.p?skuId=6371859" // Nintendo Switch
  ];

  for (const url of urls) {
    console.log(`\nAdding product: ${url}`);
    const product = await addProduct(url, 400); // 400 desired price
    
    console.log(`Scraping product: ${product.id}`);
    try {
      const result = await simulateScrapeAndExtract(product.id);
      console.log(`Result: $${result.snapshot.price} | In Stock: ${result.snapshot.inStock}`);
    } catch (e) {
      console.error(`Failed to scrape ${product.id}`);
    }
  }
}

main().catch(console.error);
