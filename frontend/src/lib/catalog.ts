export type Platform = "amazon" | "flipkart" | "blinkit" | "croma" | "reliance" | "dmart";
export type CategoryName =
  | "Electronics"
  | "Bags & Travel"
  | "Food (Protein)"
  | "Apparel"
  | "Home";

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
  {
    id: "samsung-galaxy-m17e-vibe-violet-128-gb",
    name: "Samsung Galaxy M17e Vibe Violet 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-m17e-vibe-violet-128-gb/p/itm673a019f689ae?pid=MOBHHQWGFRUKCEC3",
      amazon: "https://www.amazon.in/dp/B0FBQJF8SK",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20M17e%20Vibe%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-m17e-5g-128-gb-4-gb-ram-light-violet-mobile-phone-mpqw5e-10129091/p/10129091",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20M17e%20Vibe",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20M17e%20Vibe"
    }
  },
  {
    id: "samsung-galaxy-a07-5g-black-128-gb",
    name: "Samsung Galaxy A07 5g Black 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a07-5g-black-128-gb/p/itm375542879d8d6?pid=MOBHJXB2VAA6ZNTZ",
      amazon: "https://www.amazon.in/dp/B0BFTZQRC8",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A07%205G%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/a07-ekl-not-for-sale-ml10s2-9866768/p/9866768",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A07%205G",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A07%205G"
    }
  },
  {
    id: "samsung-galaxy-m33-5g-deep-ocean-blue-128-gb",
    name: "Samsung Galaxy M33 5g Deep Ocean Blue 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-m33-5g-deep-ocean-blue-128-gb/p/itm6fafe6189184d?pid=MOBGHDXFKZZVPYZJ",
      amazon: "https://www.amazon.in/dp/B09XPC57FT",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20M33%205G%20Deep%20Ocean%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a57-5g-256-gb-8-gb-ram-awesome-lilac-mobile-phone-mnacdt-9995159/p/9995159",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20M33%205G%20Deep%20Ocean",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20M33%205G%20Deep%20Ocean"
    }
  },
  {
    id: "samsung-galaxy-a22-5g-violet-128-gb",
    name: "Samsung Galaxy A22 5g Violet 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a22-5g-violet-128-gb/p/itmb5d178ace2f21?pid=MOBG5QZC8FXUGHHK",
      amazon: "https://www.amazon.in/dp/B09BVP3R24",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A22%205G%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a23-5g-128-gb-8-gb-ram-awesome-blue-mobile-phone-lktkga-7532763/p/7532763",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A22%205G",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A22%205G"
    }
  },
  {
    id: "samsung-galaxy-a07-5g-light-green-128-gb",
    name: "Samsung Galaxy A07 5g Light Green 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a07-5g-light-green-128-gb/p/itm375542879d8d6?pid=MOBHJXB2ZS4EAG64",
      amazon: "https://www.amazon.in/dp/B0BFTZQRC8",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A07%205G%20Light%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a07-4g-64-gb-4-gb-ram-violet-mobile-phone-mpmnj4-10090821/p/10090821",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A07%205G%20Light",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A07%205G%20Light"
    }
  },
  {
    id: "samsung-a36-5g-dark-blue-256-gb",
    name: "Samsung A36 5g Dark Blue 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-a36-5g-dark-blue-256-gb/p/itme993b087da33a?pid=MOBHNJ8FMV7RRDBA",
      amazon: "https://www.amazon.in/dp/B0CXP9LBXS",
      croma: "https://www.croma.com/searchB?q=Samsung%20A36%205G%20Dark%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a36-5g-128-gb-8-gb-ram-awesome-lavender-mobile-phone-mewjbh-9347821/p/9347821",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20A36%205G%20Dark",
      blinkit: "https://blinkit.com/s/?q=Samsung%20A36%205G%20Dark"
    }
  },
  {
    id: "samsung-galaxy-a25-5g-yellow-256-gb",
    name: "Samsung Galaxy A25 5g Yellow 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a25-5g-yellow-256-gb/p/itmcbc9ab9e9490e?pid=MOBGWD85JJX2A6ZS",
      amazon: "https://www.amazon.in/dp/B0CPJWGKBZ",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A25%205G%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a23-5g-128-gb-8-gb-ram-awesome-blue-mobile-phone-lktkga-7532763/p/7532763",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A25%205G",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A25%205G"
    }
  },
  {
    id: "samsung-galaxy-m55-5g-denim-black-black-128-gb",
    name: "Samsung Galaxy M55 5g Denim Black Black 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-m55-5g-denim-black-black-128-gb/p/itmb84fd818684b9?pid=MOBGZSRN9ZAWFCGM",
      amazon: "https://www.amazon.in/dp/B0CXPC2S75",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20M55%205G%20Denim%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-m55-5g-256-gb-12-gb-ram-denim-black-mobile-phone-lvds99-7598839/p/7598839",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20M55%205G%20Denim",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20M55%205G%20Denim"
    }
  },
  {
    id: "samsung-galaxy-s25-5g-silver-shadow-256-gb",
    name: "Samsung Galaxy S25 5g Silver Shadow 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-s25-5g-silver-shadow-256-gb/p/itm70d1f331ebbac?pid=MOBH8K8UH9XHPVGQ",
      amazon: "https://www.amazon.in/dp/B0DS6JWHPD",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20S25%205G%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-s25-5g-128-gb-12-gb-ram-icyblue-mobile-phone-m6rltr-8878214/p/8878214",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20S25%205G",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20S25%205G"
    }
  },
  {
    id: "samsung-galaxy-a27-5g-light-green-256-gb",
    name: "Samsung Galaxy A27 5g Light Green 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a27-5g-light-green-256-gb/p/itm179b783a6be17?pid=MOBHZB63ZAEDX8GZ",
      amazon: "https://www.amazon.in/dp/B0DXND98GJ",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A27%205G%20Light%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a27-5g-128-gb-6-gb-ram-light-pink-mobile-phone-mr247e-10211083/p/10211083",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A27%205G%20Light",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A27%205G%20Light"
    }
  },
  {
    id: "samsung-galaxy-a34-5g-awesome-graphite-128-gb",
    name: "Samsung Galaxy A34 5g Awesome Graphite 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a34-5g-awesome-graphite-128-gb/p/itmc2835f4dd9f3c?pid=MOBGNE4SV2YGSART",
      amazon: "https://www.amazon.in/dp/B0BXG7MN2J",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A34%205G%20Awesome%20Graphite%20128GB%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a37-5g-256-gb-8-gb-ram-awesome-graygreen-mobile-phone-mnacds-9995151/p/9995151",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A34%205G%20Awesome%20Graphite%20128GB",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A34%205G%20Awesome%20Graphite%20128GB"
    }
  },
  {
    id: "samsung-galaxy-a23-5g-light-blue-128-gb",
    name: "Samsung Galaxy A23 5g Light Blue 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a23-5g-light-blue-128-gb/p/itme9f480031af3a?pid=MOBGHT8UEEZXGGWA",
      amazon: "https://www.amazon.in/dp/B09XP9QHGR",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A23%205G%20Light%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a23-5g-128-gb-8-gb-ram-awesome-blue-mobile-phone-lktkga-7532763/p/7532763",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A23%205G%20Light",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A23%205G%20Light"
    }
  },
  {
    id: "samsung-galaxy-f70-pro-5g-aura-green-128-gb",
    name: "Samsung Galaxy F70 Pro 5g Aura Green 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-f70-pro-5g-aura-green-128-gb/p/itm37bbb9ed78024?pid=MOBHZ8YSNQQDFHFT",
      amazon: "https://www.amazon.in/dp/B0DXND3SZD",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20F70%20Pro%205G%20Aura%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-f70e-5g-128-gb-6-gb-ram-light-green-mobile-phone-mpqw4w-10129087/p/10129087",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20F70%20Pro%205G%20Aura",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20F70%20Pro%205G%20Aura"
    }
  },
  {
    id: "samsung-galaxy-f17-5g-voilet-pop-128gb-4gb-ram-poo-128-gb",
    name: "Samsung Galaxy F17 5g Voilet Pop 128gb 4gb Ram Poo 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-f17-5g-voilet-pop-128gb-4gb-ram-poo-128-gb/p/itm234a6b0a367bb?pid=MOBHKD4ADSMM4JHA",
      amazon: "https://www.amazon.in/dp/B0F5XVTPYG",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20F17%205G%20Voilet%20Pop%20128gb%204gb%20Ram%20Poo%20128GB%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/galaxy-f17-5g-128-gb-4-gb-ram-lavender-mobile-phone-mfdv5t-9379818/p/9379818",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20F17%205G%20Voilet%20Pop%20128gb%204gb%20Ram%20Poo%20128GB",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20F17%205G%20Voilet%20Pop%20128gb%204gb%20Ram%20Poo%20128GB"
    }
  },
  {
    id: "samsung-galaxy-a16-5g-gold-256-gb",
    name: "Samsung Galaxy A16 5g Gold 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a16-5g-gold-256-gb/p/itmeb3b07d3eff44?pid=MOBH5JJ4JZ97BK2D",
      amazon: "https://www.amazon.in/dp/B0DHYJ35Q7",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A16%205G%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a16-5g-128-gb-6-gb-ram-gold-mobile-phone-m4gvua-8762464/p/8762464",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A16%205G",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A16%205G"
    }
  },
  {
    id: "samsung-galaxy-m56-5g-light-green-128-gb",
    name: "Samsung Galaxy M56 5g Light Green 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-m56-5g-light-green-128-gb/p/itmf3944ff1a83d4?pid=MOBHBH86FM9VUCGU",
      amazon: "https://www.amazon.in/dp/B0F7K9N5TM",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20M56%205G%20Light%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-m36-5g-128-gb-8-gb-ram-light-green-mobile-phone-mpqw4w-10129084/p/10129084",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20M56%205G%20Light",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20M56%205G%20Light"
    }
  },
  {
    id: "samsung-galaxy-a17-5g-charger-box-black-128-gb",
    name: "Samsung Galaxy A17 5g Charger Box Black 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a17-5g-charger-box-black-128-gb/p/itm8c0f77af2ac48?pid=MOBHES2FPZD9BYDA",
      amazon: "https://www.amazon.in/dp/B0F53HY4F9",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A17%205G%20Charger%20Box%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-original-25-watt-type-c-travel-adapter-without-cable-black-lw0w92-7625922/p/7625922",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A17%205G%20Charger%20Box",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A17%205G%20Charger%20Box"
    }
  },
  {
    id: "samsung-s25-ultra-5g-titanium-gray-256-gb",
    name: "Samsung S25 Ultra 5g Titanium Gray 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-s25-ultra-5g-titanium-gray-256-gb/p/itm566994e00dfc0?pid=MOBH8K8U7F5FKSXA",
      amazon: "https://www.amazon.in/dp/B0DS6MLKQF",
      croma: "https://www.croma.com/searchB?q=Samsung%20S25%20Ultra%205G%20Titanium%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-s25-edge-512-gb-12-gb-ram-titanium-silver-mobile-phone-mao6zf-9204680/p/9204680",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20S25%20Ultra%205G%20Titanium",
      blinkit: "https://blinkit.com/s/?q=Samsung%20S25%20Ultra%205G%20Titanium"
    }
  },
  {
    id: "samsung-galaxy-s24-fe-5g-mint-128-gb",
    name: "Samsung Galaxy S24 Fe 5g Mint 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-s24-fe-5g-mint-128-gb/p/itme960199e26f23?pid=MOBH4ZG3TSXHKXH2",
      amazon: "https://www.amazon.in/dp/B0DKGB3GZL",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20S24%20Fe%205G%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-s24-fe-5g-256-gb-8-gb-ram-blue-mobile-phone-m22zbr-8659415/p/8659415",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20S24%20Fe%205G",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20S24%20Fe%205G"
    }
  },
  {
    id: "samsung-galaxy-f16-5g-bling-black-128-gb",
    name: "Samsung Galaxy F16 5g Bling Black 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-f16-5g-bling-black-128-gb/p/itmc78bc1cee0259?pid=MOBH9ASGP3ZH2AF7",
      amazon: "https://www.amazon.in/dp/B0DFWVQ49Y",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20F16%205G%20Bling%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/galaxy-f17-5g-128-gb-6-gb-ram-neo-black-mobile-phone-mfdw1v-9379831/p/9379831",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20F16%205G%20Bling",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20F16%205G%20Bling"
    }
  },
  {
    id: "samsung-galaxy-s25-fe-5g-white-256-gb",
    name: "Samsung Galaxy S25 Fe 5g White 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-s25-fe-5g-white-256-gb/p/itm686ea83612e85?pid=MOBHFHS5AAWF2SZP",
      amazon: "https://www.amazon.in/dp/B0DQVY5W9W",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20S25%20Fe%205G%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-s25-fe-5g-512-gb-8-gb-ram-navy-mobile-phone-with-galaxy-ai-mfnuvs-9426174/p/9426174",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20S25%20Fe%205G",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20S25%20Fe%205G"
    }
  },
  {
    id: "samsung-galaxy-a34-5g-awesome-lime-128-gb",
    name: "Samsung Galaxy A34 5g Awesome Lime 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a34-5g-awesome-lime-128-gb/p/itm703c48762430c?pid=MOBGNE4SHFTVUZTG",
      amazon: "https://www.amazon.in/dp/B0BXG7MN2J",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A34%205G%20Awesome%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a37-5g-256-gb-8-gb-ram-awesome-graygreen-mobile-phone-mnacds-9995151/p/9995151",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A34%205G%20Awesome",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A34%205G%20Awesome"
    }
  },
  {
    id: "samsung-galaxy-a15-5g-light-blue-128-gb",
    name: "Samsung Galaxy A15 5g Light Blue 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a15-5g-light-blue-128-gb/p/itm7ebaa454bf5cb?pid=MOBGWD85TPKVHRUA",
      amazon: "https://www.amazon.in/dp/B0CPJWH7PC",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A15%205G%20Light%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a27-5g-256-gb-8-gb-ram-light-green-mobile-phone-mr247e-10211084/p/10211084",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A15%205G%20Light",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A15%205G%20Light"
    }
  },
  {
    id: "samsung-galaxy-s24-5g-snapdragon-marble-gray-128-gb",
    name: "Samsung Galaxy S24 5g Snapdragon Marble Gray 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-s24-5g-snapdragon-marble-gray-128-gb/p/itm8f6413060b707?pid=MOBHDVFKCP3DZG4G",
      amazon: "https://www.amazon.in/dp/B0CS5HG2ZM",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20S24%205G%20Snapdragon%20Marble%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-s24-ultra-5g-clear-gadget-transparent-lsyalx-7536699/p/7536699",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20S24%205G%20Snapdragon%20Marble",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20S24%205G%20Snapdragon%20Marble"
    }
  },
  {
    id: "samsung-galaxy-a37-5g-awesome-graygreen-128-gb",
    name: "Samsung Galaxy A37 5g Awesome Graygreen 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a37-5g-awesome-graygreen-128-gb/p/itm793d1b5fe9bc5?pid=MOBHHENSWEXBWPFT",
      amazon: "https://www.amazon.in/dp/B0DG85P48R",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A37%205G%20Awesome%20Graygreen%20128GB%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a37-5g-256-gb-8-gb-ram-awesome-graygreen-mobile-phone-mnacds-9995151/p/9995151",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A37%205G%20Awesome%20Graygreen%20128GB",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A37%205G%20Awesome%20Graygreen%20128GB"
    }
  },
  {
    id: "samsung-galaxy-a07-5g-light-violet-128-gb",
    name: "Samsung Galaxy A07 5g Light Violet 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a07-5g-light-violet-128-gb/p/itm375542879d8d6?pid=MOBHJXB2ZGF23HHU",
      amazon: "https://www.amazon.in/dp/B0BFTZQRC8",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A07%205G%20Light%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a07-4g-64-gb-4-gb-ram-violet-mobile-phone-mpmnj4-10090821/p/10090821",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A07%205G%20Light",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A07%205G%20Light"
    }
  },
  {
    id: "samsung-galaxy-m35-5g-moonlight-blue-256-gb",
    name: "Samsung Galaxy M35 5g Moonlight Blue 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-m35-5g-moonlight-blue-256-gb/p/itm29aa1fda30b15?pid=MOBH2Z9TF9G5D5AV",
      amazon: "https://www.amazon.in/dp/B0D5NKM4YP",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20M35%205G%20Moonlight%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-m36-5g-128-gb-8-gb-ram-black-mobile-phone-mpqw4w-10129092/p/10129092",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20M35%205G%20Moonlight",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20M35%205G%20Moonlight"
    }
  },
  {
    id: "samsung-galaxy-m55-5g-light-green-256-gb",
    name: "Samsung Galaxy M55 5g Light Green 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-m55-5g-light-green-256-gb/p/itmb84fd818684b9?pid=MOBGZST9A7J9BCT3",
      amazon: "https://www.amazon.in/dp/B0CXPC2S75",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20M55%205G%20Light%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-m55-5g-256-gb-12-gb-ram-denim-black-mobile-phone-lvds99-7598839/p/7598839",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20M55%205G%20Light",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20M55%205G%20Light"
    }
  },
  {
    id: "samsung-galaxy-a25-5g-blue-256-gb",
    name: "Samsung Galaxy A25 5g Blue 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a25-5g-blue-256-gb/p/itmd15076d2a4ee2?pid=MOBGWD85EFMNET7K",
      amazon: "https://www.amazon.in/dp/B0CPJWGKBZ",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A25%205G%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a23-5g-128-gb-8-gb-ram-awesome-blue-mobile-phone-lktkga-7532763/p/7532763",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A25%205G",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A25%205G"
    }
  },
  {
    id: "samsung-galaxy-s24-5g-snapdragon-amber-yellow-128-gb",
    name: "Samsung Galaxy S24 5g Snapdragon Amber Yellow 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-s24-5g-snapdragon-amber-yellow-128-gb/p/itmd4baa945a78ef?pid=MOBHDVFKSZNEZGXW",
      amazon: "https://www.amazon.in/dp/B0CS5HG2ZM",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20S24%205G%20Snapdragon%20Amber%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/belkin-boostup-f7u088btwht-10-watts-wireless-charging-pad-white/p/7511075",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20S24%205G%20Snapdragon%20Amber",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20S24%205G%20Snapdragon%20Amber"
    }
  },
  {
    id: "samsung-galaxy-s25-fe-5g-white-128-gb",
    name: "Samsung Galaxy S25 Fe 5g White 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-s25-fe-5g-white-128-gb/p/itm686ea83612e85?pid=MOBHFHS5EBV9FDYZ",
      amazon: "https://www.amazon.in/dp/B0DQVY5W9W",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20S25%20Fe%205G%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-s25-fe-5g-512-gb-8-gb-ram-navy-mobile-phone-with-galaxy-ai-mfnuvs-9426174/p/9426174",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20S25%20Fe%205G",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20S25%20Fe%205G"
    }
  },
  {
    id: "samsung-galaxy-f70-pro-5g-alpha-black-128-gb",
    name: "Samsung Galaxy F70 Pro 5g Alpha Black 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-f70-pro-5g-alpha-black-128-gb/p/itm37bbb9ed78024?pid=MOBHZ8YSUXXHYGBR",
      amazon: "https://www.amazon.in/dp/B0DXND3SZD",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20F70%20Pro%205G%20Alpha%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-f70e-5g-128-gb-6-gb-ram-light-green-mobile-phone-mpqw4w-10129087/p/10129087",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20F70%20Pro%205G%20Alpha",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20F70%20Pro%205G%20Alpha"
    }
  },
  {
    id: "samsung-galaxy-a37-5g-awesome-charcoal-256-gb",
    name: "Samsung Galaxy A37 5g Awesome Charcoal 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a37-5g-awesome-charcoal-256-gb/p/itm793d1b5fe9bc5?pid=MOBHHENSAGYPYZVU",
      amazon: "https://www.amazon.in/dp/B0DG85P48R",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A37%205G%20Awesome%20Charcoal%20256GB%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a37-5g-256-gb-8-gb-ram-awesome-lavender-mobile-phone-mnacdr-9995154/p/9995154",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A37%205G%20Awesome%20Charcoal%20256GB",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A37%205G%20Awesome%20Charcoal%20256GB"
    }
  },
  {
    id: "samsung-galaxy-m35-5g-daybreak-blue-256-gb",
    name: "Samsung Galaxy M35 5g Daybreak Blue 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-m35-5g-daybreak-blue-256-gb/p/itm94360d23ec184?pid=MOBH2Z9ZNJKYDE4D",
      amazon: "https://www.amazon.in/dp/B0D5NKM4YP",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20M35%205G%20Daybreak%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-m36-5g-128-gb-8-gb-ram-black-mobile-phone-mpqw4w-10129092/p/10129092",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20M35%205G%20Daybreak",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20M35%205G%20Daybreak"
    }
  },
  {
    id: "samsung-galaxy-m52-5g-blazing-black-128-gb",
    name: "Samsung Galaxy M52 5g Blazing Black 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-m52-5g-blazing-black-128-gb/p/itmd526e9c381999?pid=MOBGHDXFZSJCXW6V",
      amazon: "https://www.amazon.in/dp/B09G9FP6CG",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20M52%205G%20Blazing%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/search?q=Samsung%20Galaxy%20M52%205G%20Blazing%20Black%20128GB%3Arelevance",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20M52%205G%20Blazing",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20M52%205G%20Blazing"
    }
  },
  {
    id: "samsung-galaxy-s26-5g-black-512-gb",
    name: "Samsung Galaxy S26 5g Black 512 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-s26-5g-black-512-gb/p/itmf5ed5d08eef13?pid=MOBHKGAPSUWSYAVH",
      amazon: "https://www.amazon.in/dp/B0F4CQTQGJ",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20S26%205G%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-s26-5g-256-gb-12-gb-ram-with-ai-phone-photo-assist-creative-studio-4300-mah-battery-white-mobile-phone-mm3con-9959776/p/9959776",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20S26%205G",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20S26%205G"
    }
  },
  {
    id: "samsung-galaxy-f70-pro-5g-aura-green-256-gb",
    name: "Samsung Galaxy F70 Pro 5g Aura Green 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-f70-pro-5g-aura-green-256-gb/p/itm37bbb9ed78024?pid=MOBHZ8YSEBSR9U77",
      amazon: "https://www.amazon.in/dp/B0DXND3SZD",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20F70%20Pro%205G%20Aura%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-f70e-5g-128-gb-6-gb-ram-light-green-mobile-phone-mpqw4w-10129087/p/10129087",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20F70%20Pro%205G%20Aura",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20F70%20Pro%205G%20Aura"
    }
  },
  {
    id: "samsung-galaxy-a16-5g-blue-black-256-gb",
    name: "Samsung Galaxy A16 5g Blue Black 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a16-5g-blue-black-256-gb/p/itmeb3b07d3eff44?pid=MOBH5JJ4WYRGRYWB",
      amazon: "https://www.amazon.in/dp/B0DHYJ35Q7",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A16%205G%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a16-5g-128-gb-6-gb-ram-gold-mobile-phone-m4gvua-8762464/p/8762464",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A16%205G",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A16%205G"
    }
  },
  {
    id: "samsung-galaxy-a37-5g-awesome-charcoal-128-gb",
    name: "Samsung Galaxy A37 5g Awesome Charcoal 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a37-5g-awesome-charcoal-128-gb/p/itm793d1b5fe9bc5?pid=MOBHHENSZADTY7KP",
      amazon: "https://www.amazon.in/dp/B0DG85P48R",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A37%205G%20Awesome%20Charcoal%20128GB%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a37-5g-256-gb-8-gb-ram-awesome-lavender-mobile-phone-mnacdr-9995154/p/9995154",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A37%205G%20Awesome%20Charcoal%20128GB",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A37%205G%20Awesome%20Charcoal%20128GB"
    }
  },
  {
    id: "samsung-galaxy-a27-5g-light-green-128-gb",
    name: "Samsung Galaxy A27 5g Light Green 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a27-5g-light-green-128-gb/p/itm179b783a6be17?pid=MOBHZB64RAJSFCSY",
      amazon: "https://www.amazon.in/dp/B0DXND98GJ",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A27%205G%20Light%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a27-5g-128-gb-6-gb-ram-light-pink-mobile-phone-mr247e-10211083/p/10211083",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A27%205G%20Light",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A27%205G%20Light"
    }
  },
  {
    id: "samsung-m36-5g-orange-haze-orange-128-gb",
    name: "Samsung M36 5g Orange Haze Orange 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-m36-5g-orange-haze-orange-128-gb/p/itm74130a5a313b6?pid=MOBHEYY2ZCYCQMRB",
      amazon: "https://www.amazon.in/dp/B0F2YTBHZ6",
      croma: "https://www.croma.com/searchB?q=Samsung%20M36%205G%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-m36-5g-128-gb-8-gb-ram-light-green-mobile-phone-mpqw4w-10129084/p/10129084",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20M36%205G",
      blinkit: "https://blinkit.com/s/?q=Samsung%20M36%205G"
    }
  },
  {
    id: "samsung-galaxy-a16-5g-blue-black-128-gb",
    name: "Samsung Galaxy A16 5g Blue Black 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a16-5g-blue-black-128-gb/p/itmeb3b07d3eff44?pid=MOBH5JJ4XDZAMCR2",
      amazon: "https://www.amazon.in/dp/B0DHYJ35Q7",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A16%205G%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a16-5g-128-gb-6-gb-ram-gold-mobile-phone-m4gvua-8762464/p/8762464",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A16%205G",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A16%205G"
    }
  },
  {
    id: "samsung-galaxy-f54-5g-meteor-blue-256-gb",
    name: "Samsung Galaxy F54 5g Meteor Blue 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-f54-5g-meteor-blue-256-gb/p/itmc0ff2e34818c7?pid=MOBGPN55SKDKVRQV",
      amazon: "https://www.amazon.in/dp/B0C6HXQMWG",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20F54%205G%20Meteor%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a37-5g-256-gb-8-gb-ram-awesome-charcoal-mobile-phone-mnacdr-9995153/p/9995153",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20F54%205G%20Meteor",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20F54%205G%20Meteor"
    }
  },
  {
    id: "samsung-galaxy-m55-5g-danim-black-256-gb",
    name: "Samsung Galaxy M55 5g Danim Black 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-m55-5g-danim-black-256-gb/p/itmb84fd818684b9?pid=MOBGZSTJCNNHXMFP",
      amazon: "https://www.amazon.in/dp/B0CXPC2S75",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20M55%205G%20Danim%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-m55-5g-256-gb-12-gb-ram-denim-black-mobile-phone-lvds99-7598839/p/7598839",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20M55%205G%20Danim",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20M55%205G%20Danim"
    }
  },
  {
    id: "samsung-galaxy-a57-5g-awesome-navy-256-gb",
    name: "Samsung Galaxy A57 5g Awesome Navy 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a57-5g-awesome-navy-256-gb/p/itm0a21d467664e9?pid=MOBHHENSQGDADRCW",
      amazon: "https://www.amazon.in/dp/B0F8PJJTWQ",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A57%205G%20Awesome%20Navy%20256GB%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a57-5g-256-gb-8-gb-ram-awesome-icyblue-mobile-phone-mnacds-9995155/p/9995155",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A57%205G%20Awesome%20Navy%20256GB",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A57%205G%20Awesome%20Navy%20256GB"
    }
  },
  {
    id: "samsung-galaxy-s21-fe-5g-snapdragon-888-lavender-128-gb",
    name: "Samsung Galaxy S21 Fe 5g Snapdragon 888 Lavender 128 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-s21-fe-5g-snapdragon-888-lavender-128-gb/p/itm9189006529d08?pid=MOBGTKQGKGYZDJZY",
      amazon: "https://www.amazon.in/dp/B09BVNP9ZG",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20S21%20Fe%205G%20Snapdragon%20888%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-z-flip7-fe-5g-128-gb-8-gb-ram-white-mobile-phone-mcym36-9286496/p/9286496",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20S21%20Fe%205G%20Snapdragon%20888",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20S21%20Fe%205G%20Snapdragon%20888"
    }
  },
  {
    id: "samsung-galaxy-a36-5g-awesome-white-256-gb",
    name: "Samsung Galaxy A36 5g Awesome White 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a36-5g-awesome-white-256-gb/p/itm2f14454f7dc29?pid=MOBH9RNGWSX2XDZX",
      amazon: "https://www.amazon.in/dp/B0CXP9LBXS",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A36%205G%20Awesome%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a36-5g-128-gb-8-gb-ram-awesome-black-mobile-phone-m7x9sv-8968996/p/8968996",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A36%205G%20Awesome",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A36%205G%20Awesome"
    }
  },
  {
    id: "samsung-galaxy-a57-5g-awesome-lilac-256-gb",
    name: "Samsung Galaxy A57 5g Awesome Lilac 256 Gb",
    category: "Electronics",
    urls: {
      flipkart: "https://www.flipkart.com/samsung-galaxy-a57-5g-awesome-lilac-256-gb/p/itm0a21d467664e9?pid=MOBHHENSGTCFGXFT",
      amazon: "https://www.amazon.in/dp/B0F8PJJTWQ",
      croma: "https://www.croma.com/searchB?q=Samsung%20Galaxy%20A57%205G%20Awesome%20Lilac%20256GB%3Arelevance&langCode=en",
      reliance: "https://www.reliancedigital.in/samsung-galaxy-a57-5g-256-gb-8-gb-ram-awesome-icyblue-mobile-phone-mnacds-9995155/p/9995155",
      dmart: "https://www.dmart.in/catalog/search?q=Samsung%20Galaxy%20A57%205G%20Awesome%20Lilac%20256GB",
      blinkit: "https://blinkit.com/s/?q=Samsung%20Galaxy%20A57%205G%20Awesome%20Lilac%20256GB"
    }
  },
  {
    id: "dataset-led-tv",
    name: "LED Television",
    category: "Electronics",
    urls: {},
  },
  {
    id: "dataset-mens-jeans",
    name: "Men's Jeans",
    category: "Apparel",
    urls: {},
  },
  {
    id: "dataset-casual-tshirt",
    name: "Casual T-shirt",
    category: "Apparel",
    urls: {},
  },
  {
    id: "dataset-living-sofa",
    name: "Living room sofa",
    category: "Home",
    urls: {},
  },
];

export const CATEGORIES: CategoryName[] = [
  "Electronics",
  "Bags & Travel",
  "Food (Protein)",
  "Apparel",
  "Home",
];
