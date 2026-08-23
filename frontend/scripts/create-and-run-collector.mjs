/**
 * Create a Bright Data Scraper Studio collector and run it once.
 * Public product URL only. Prints Collector ID as proof. Never prints the API token.
 *
 *   cd frontend
 *   node scripts/create-and-run-collector.mjs
 *
 * Then paste the printed Collector ID into frontend/.env.local as BRIGHT_DATA_COLLECTOR_ID
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const API = "https://api.brightdata.com";
const TOKEN = process.env.BRIGHT_DATA_API_TOKEN || "";
/** Bright Data public demo shop — no login, no paywall, no personal data. */
const PUBLIC_URL =
  process.env.BRIGHT_DATA_PUBLIC_SAMPLE_URL ||
  "https://ecommerce-shop-brd.vercel.app/product/echo-portable-speaker";

function assertToken() {
  if (!TOKEN) {
    console.error("Missing BRIGHT_DATA_API_TOKEN in frontend/.env.local");
    process.exit(1);
  }
}

async function createCollector() {
  const res = await fetch(`${API}/dca/collector`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `anawiser-public-prices-${Date.now()}`,
      deliver: {
        type: "webhook",
        endpoint: "https://example.com/webhook",
        filename: { template: "data", extension: "json" },
      },
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Create collector failed", res.status, JSON.stringify(body));
    process.exit(1);
  }
  return body.id || body.collector_id;
}

async function automateTemplate(collectorId) {
  const res = await fetch(`${API}/dca/collectors/${collectorId}/automate_template`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      description: "From this public product page extract title and visible price only. No personal data.",
      urls: [PUBLIC_URL],
    }),
  });
  if (!res.ok) {
    console.warn("Template automation returned", res.status, "— collector still usable from the Bright Data UI.");
    return;
  }
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const prog = await fetch(`${API}/dca/collectors/${collectorId}/automate_template/progress`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const data = await prog.json().catch(() => ({}));
    process.stdout.write(`template status: ${data.status || prog.status}\n`);
    if (data.status === "done") return;
    if (data.status === "failed") {
      console.warn("Template automation failed — finish in the Bright Data UI, Collector ID is still valid.");
      return;
    }
  }
}

async function runCollector(collectorId) {
  const res = await fetch(`${API}/dca/trigger?collector=${collectorId}&queue_next=1`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify([{ url: PUBLIC_URL }]),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Run failed", res.status, JSON.stringify(body));
    process.exit(1);
  }
  return body.collection_id || body.snapshot_id || body.collection_id;
}

assertToken();

const existing = process.env.BRIGHT_DATA_COLLECTOR_ID;
const collectorId = existing || (await createCollector());
if (!existing) {
  console.log("Created collector.");
  await automateTemplate(collectorId);
} else {
  console.log("Using existing BRIGHT_DATA_COLLECTOR_ID from .env.local");
}

const collectionId = await runCollector(collectorId);

console.log("");
console.log("PROOF — Collector ID:", collectorId);
console.log("PROOF — Collection / snapshot ID:", collectionId || "(pending)");
console.log("Public URL used:", PUBLIC_URL);
console.log("");
console.log("Add this line to frontend/.env.local (do not commit it, do not show the API token in a demo):");
console.log(`BRIGHT_DATA_COLLECTOR_ID=${collectorId}`);
console.log("");
console.log("Dashboard wiring: GET /api/anawiser/collector and Compare → live prices.");
