import { getProducts, addSnapshot } from "@anawiser/backend";

// ── Configuration ──

const API_BASE = "https://api.brightdata.com";
const POLL_INTERVAL_MS = 3000;   // Check every 3 seconds
const MAX_POLL_ATTEMPTS = 40;    // Give up after ~2 minutes

/**
 * Triggers a Bright Data Scraper Studio collector for the given product URL,
 * waits for results, and saves a price/stock snapshot to the database.
 *
 * Flow:
 *   1. Look up the product in the database
 *   2. POST /dca/trigger  →  start the collector with the product URL
 *   3. GET  /dca/dataset   →  poll until results are ready
 *   4. Save the result as a snapshot
 *   5. Return the snapshot + any price alert
 */
export async function simulateScrapeAndExtract(productId: string) {
  // ── 1. Look up the product ──
  const products = await getProducts();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // ── Read config from environment variables ──
  const apiToken = process.env.BRIGHT_DATA_API_TOKEN;
  const collectorId = process.env.BRIGHT_DATA_COLLECTOR_ID;

  if (!apiToken) {
    throw new Error(
      "BRIGHT_DATA_API_TOKEN is not set. " +
      "Go to Bright Data → Account Settings → API Tokens and add it to .env.local"
    );
  }
  if (!collectorId) {
    throw new Error(
      "BRIGHT_DATA_COLLECTOR_ID is not set. " +
      "Create a collector in Scraper Studio and add the ID to .env.local. " +
      "See docs/EXPLAINER.md for step-by-step instructions."
    );
  }

  const headers = {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  };

  // ── 2. Trigger the collector ──
  console.log(`[Anawiser] Triggering collector ${collectorId} for: ${product.url}`);

  const triggerRes = await fetch(
    `${API_BASE}/dca/trigger?collector=${collectorId}`,
    {
      method: "POST",
      headers,
      body: JSON.stringify([{ url: product.url }]),
    }
  );

  if (!triggerRes.ok) {
    const errText = await triggerRes.text();
    throw new Error(
      `Bright Data trigger failed (${triggerRes.status}): ${errText}`
    );
  }

  const triggerData = await triggerRes.json();
  const collectionId = triggerData.collection_id || triggerData.snapshot_id;

  if (!collectionId) {
    throw new Error(
      `Bright Data returned no collection_id. Response: ${JSON.stringify(triggerData)}`
    );
  }

  console.log(`[Anawiser] Collection started: ${collectionId}. Polling for results...`);

  // ── 3. Poll for results ──
  let results: any[] | null = null;

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await sleep(POLL_INTERVAL_MS);

    const datasetRes = await fetch(
      `${API_BASE}/dca/dataset?id=${collectionId}`,
      { headers: { Authorization: `Bearer ${apiToken}` } }
    );

    if (datasetRes.status === 200) {
      const contentType = datasetRes.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const body = await datasetRes.json();

        // If it's an array of results, we're done
        if (Array.isArray(body) && body.length > 0) {
          results = body;
          break;
        }

        // If it's a status object (still running), keep polling
        if (body.status && body.status !== "ready") {
          console.log(`[Anawiser] Still running (${body.status})... attempt ${attempt + 1}/${MAX_POLL_ATTEMPTS}`);
          continue;
        }
      }
    }

    // Non-200 or unexpected format — keep trying
    console.log(`[Anawiser] Waiting for results... attempt ${attempt + 1}/${MAX_POLL_ATTEMPTS}`);
  }

  if (!results || results.length === 0) {
    throw new Error(
      `Scraper Studio did not return results after ${MAX_POLL_ATTEMPTS} attempts for collection ${collectionId}`
    );
  }

  // ── 4. Extract data from the first result ──
  const scraped = results[0];
  console.log(`[Anawiser] Got result:`, JSON.stringify(scraped, null, 2));

  // Scraper Studio returns structured data — field names depend on your collector config.
  // Common fields: price, title, in_stock, currency, url
  const currentPrice = parseFloat(scraped.price) || null;
  const isInStock = scraped.in_stock === true || scraped.in_stock === "true" || scraped.availability === "In Stock";
  const title = scraped.title || scraped.name || null;
  const currency = scraped.currency || "INR";

  // ── 5. Save snapshot to database ──
  const snapshot = await addSnapshot({
    productId: product.id,
    price: currentPrice,
    inStock: isInStock,
    currency: currency,
    stockText: isInStock ? "In Stock" : "Currently Unavailable",
  });

  // ── 6. Check if we should alert the user ──
  let alertMessage = null;

  if (isInStock && currentPrice !== null) {
    if (product.desiredPrice === null || currentPrice <= product.desiredPrice) {
      alertMessage =
        `✅ PRICE ALERT: ${title || product.url}\n` +
        `Price: ₹${currentPrice.toFixed(2)} ${currency}\n` +
        (product.desiredPrice ? `Your target: ₹${product.desiredPrice.toFixed(2)}` : "");
    }
  }

  return { snapshot, alert: alertMessage };
}

// ── Utility ──

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
