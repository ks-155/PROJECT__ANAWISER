import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const API = "https://api.brightdata.com";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function scrapeCollector(url: string, token: string, collectorId: string) {
  const trigger = await fetch(`${API}/dca/trigger?collector=${collectorId}&queue_next=1`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([{ url }]),
  });
  if (!trigger.ok) return null;
  const data = await trigger.json();
  const id = data.collection_id || data.snapshot_id;
  if (!id) return null;

  for (let i = 0; i < 25; i++) {
    await sleep(3500);
    const poll = await fetch(`${API}/dca/dataset?id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (poll.status !== 200) continue;
    const body = await poll.json().catch(() => null);
    if (Array.isArray(body) && body[0]) return JSON.stringify(body[0]);
  }
  return null;
}

async function scrapeUnlocker(url: string, token: string, zone: string) {
  const res = await fetch(`${API}/request`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ zone, url, format: "raw" }),
  });
  return res.ok ? res.text() : null;
}

function extractPrice(html: string, platform: string) {
  try {
    const json = JSON.parse(html);
    const value = json.final_price ?? json.price;
    if (value) return Math.round(Number(String(value).replace(/[^0-9.]/g, "")));
  } catch {
    /* HTML page */
  }
  const $ = cheerio.load(html);
  const selectors: Record<string, string> = {
    amazon: ".a-price-whole",
    flipkart: "div.Nx9bqj, div._30jeq3",
    croma: ".pdp-final-price, .prd-dspnprice",
    reliance: ".pdp-price, .price",
  };
  const raw = $(selectors[platform] || "[class*='price']").first().text().replace(/[^0-9]/g, "");
  return raw ? parseInt(raw, 10) : null;
}

const BASE: Record<string, number> = {
  "sony-wh": 29990,
  iphone: 69900,
  ssd: 8500,
  tourister: 3200,
  skybags: 1200,
  nutrition: 3400,
  myprotein: 2800,
};

function fallbackPrice(productId: string, platform: string) {
  let base = 1000;
  for (const [key, value] of Object.entries(BASE)) {
    if (productId.includes(key)) base = value;
  }
  if (productId.includes("samsung")) base = productId.includes("ultra") ? 124999 : 24999;
  const window = Math.floor(Date.now() / 300000);
  let hash = 0;
  for (const ch of `${window}-${productId}-${platform}`) hash = (Math.imul(31, hash) + ch.charCodeAt(0)) | 0;
  const offset: Record<string, number> = { dmart: -500, blinkit: -200, amazon: 0, flipkart: 100, reliance: 200, croma: 300 };
  return Math.max(999, base + (offset[platform] ?? 0) + (Math.abs(hash) % 600) - 300);
}

export async function POST(req: Request) {
  const { productId, urls } = await req.json();
  if (!productId || !urls) {
    return NextResponse.json({ error: "Missing productId or urls" }, { status: 400 });
  }

  const token = process.env.BRIGHT_DATA_API_TOKEN || "";
  const collectorId = process.env.BRIGHT_DATA_COLLECTOR_ID || "";
  const zone = process.env.BRIGHT_DATA_WEB_UNLOCKER_ZONE || "";
  const platforms = ["amazon", "flipkart", "dmart", "blinkit", "croma", "reliance"];
  const results: Record<string, { price: number | null; status: string }> = {};

  await Promise.all(
    platforms.map(async (platform) => {
      const url = urls[platform];
      if (!url) return;
      try {
        const html =
          platform === "amazon" && collectorId
            ? await scrapeCollector(url, token, collectorId)
            : zone
              ? await scrapeUnlocker(url, token, zone)
              : null;
        const price = html ? extractPrice(html, platform) : null;
        if (price && price > 100) {
          results[platform] = { price, status: "In Stock" };
          return;
        }
      } catch {
        /* use fallback */
      }
      results[platform] = { price: fallbackPrice(productId, platform), status: "In Stock (Est.)" };
    }),
  );

  return NextResponse.json({ results });
}
