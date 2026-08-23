export type Platform = "amazon" | "flipkart" | "blinkit" | "croma" | "reliance" | "dmart";
export type CategoryName = "Electronics" | "Bags & Travel" | "Food (Protein)";

export interface CatalogProduct {
  id: string;
  name: string;
  category: CategoryName;
  urls: Partial<Record<Platform, string>>;
}

export const CATALOG: CatalogProduct[] = [
  // Electronics
  {
    id: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Electronics",
    urls: {
      amazon: "https://www.amazon.in/Sony-WH-1000XM5-Cancelling-Headphones-Bluetooth/dp/B0B666ZTBZ",
      flipkart: "https://www.flipkart.com/sony-wh-1000xm5-active-noise-cancelling-bluetooth-headset/p/itmd0665d5062635",
      croma: "https://www.croma.com/sony-wh-1000xm5-bluetooth-headset-with-mic/p/257321",
      reliance: "https://www.reliancedigital.in/sony-wh-1000xm5-wireless-noise-cancelling-headphones/p/493173167",
    },
  },
  {
    id: "iphone-15-128gb",
    name: "Apple iPhone 15 (128 GB)",
    category: "Electronics",
    urls: {
      amazon: "https://www.amazon.in/Apple-iPhone-15-128-GB/dp/B0CHX1W1XY",
      flipkart: "https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4",
      croma: "https://www.croma.com/apple-iphone-15-128gb-black-/p/300652",
      reliance: "https://www.reliancedigital.in/apple-iphone-15-128gb-black/p/493837777",
      blinkit: "https://blinkit.com/prn/apple-iphone-15/prid/510167",
    },
  },
  {
    id: "samsung-ssd-1tb",
    name: "Samsung 980 PRO 1TB PCIe NVMe Gen4",
    category: "Electronics",
    urls: {
      amazon: "https://www.amazon.in/Samsung-980-PRO-1TB-MZ-V8P1T0B/dp/B08GLX7TNT",
      flipkart: "https://www.flipkart.com/samsung-980-pro-1-tb-desktop-laptop-internal-solid-state-drive/p/itmc24578ef4f51e",
    },
  },

  // Bags & Travel
  {
    id: "american-tourister-ivy",
    name: "American Tourister Ivy 68 cms Polypropylene Spinner",
    category: "Bags & Travel",
    urls: {
      amazon: "https://www.amazon.in/American-Tourister-Spinner-Luggage-FO1-009-002/dp/B082P1HFFY",
      flipkart: "https://www.flipkart.com/american-tourister-ivy-68-cm-spinner-suitcase/p/itm5a1e4ff3a647b",
      dmart: "https://www.dmart.in/product/american-tourister-ivy-spinner-suitcase",
    },
  },
  {
    id: "skybags-brat",
    name: "Skybags Brat Black 46 Cms Casual Backpack",
    category: "Bags & Travel",
    urls: {
      amazon: "https://www.amazon.in/Skybags-Brat-Black-Casual-Backpack/dp/B08Z1HHMXN",
      flipkart: "https://www.flipkart.com/skybags-brat-backpack/p/itm3d7f763b655fc",
    },
  },

  // Food (Protein)
  {
    id: "optimum-nutrition-whey",
    name: "Optimum Nutrition (ON) Gold Standard 100% Whey (Non-Vegan)",
    category: "Food (Protein)",
    urls: {
      amazon: "https://www.amazon.in/Optimum-Nutrition-Standard-Protein-Vegetarian/dp/B000QSTBNS",
      flipkart: "https://www.flipkart.com/optimum-nutrition-gold-standard-100-whey-protein/p/itmd5c99452b453e",
      blinkit: "https://blinkit.com/prn/on-gold-standard-whey-protein/prid/145892",
    },
  },
  {
    id: "myprotein-vegan-blend",
    name: "Myprotein Vegan Protein Blend (Vegan)",
    category: "Food (Protein)",
    urls: {
      amazon: "https://www.amazon.in/Myprotein-Vegan-Protein-Blend-Chocolate/dp/B073XQQW79",
      flipkart: "https://www.flipkart.com/myprotein-vegan-protein-blend/p/itmaec5e347c6fb2",
    },
  },
];

export const CATEGORIES: CategoryName[] = ["Electronics", "Bags & Travel", "Food (Protein)"];
