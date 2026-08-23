/**
 * Scraper Studio Self-Healing (official API).
 * https://docs.brightdata.com/datasets/scraper-studio/self-healing-tool
 *
 *   cd frontend
 *   npm run collector:heal
 *
 * Same Collector ID is kept. API token is never printed.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

if (existsSync(envPath)) {
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

const TOKEN = process.env.BRIGHT_DATA_API_TOKEN || "";
const COLLECTOR = process.env.BRIGHT_DATA_COLLECTOR_ID || "";
const API = "https://api.brightdata.com";
const PROMPT =
  "The 'price' value is returning 'undefined', please fix. Keep title and visible list price only. Public product pages only.";

if (!TOKEN || !COLLECTOR) {
  console.error("Need BRIGHT_DATA_API_TOKEN and BRIGHT_DATA_COLLECTOR_ID in frontend/.env.local");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

const trigger = await fetch(`${API}/dca/collectors/${COLLECTOR}/refactor_template`, {
  method: "POST",
  headers,
  body: JSON.stringify({ prompt: PROMPT, custom_input: [] }),
});

if (!trigger.ok) {
  console.error("Self-Healing trigger failed", trigger.status, await trigger.text());
  process.exit(1);
}

console.log("Self-Healing started. Collector ID (unchanged):", COLLECTOR);

for (let i = 0; i < 45; i++) {
  await new Promise((r) => setTimeout(r, 20000));
  const prog = await fetch(`${API}/dca/collectors/${COLLECTOR}/refactor_template/progress`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const data = await prog.json().catch(() => ({}));
  const status = data.status || prog.status;
  console.log("heal status:", status, data.step || "");

  if (status === "pending_answer" || data.step === "user_approval") {
    await fetch(`${API}/dca/collectors/${COLLECTOR}/resume_automation_job`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message: true, auto_save: true }),
    });
    console.log("Approved Self-Healing diff (auto_save).");
  }
  if (["done", "completed", "success"].includes(String(status).toLowerCase())) {
    console.log("Self-Healing finished. Same Collector ID:", COLLECTOR);
    process.exit(0);
  }
  if (["failed", "error", "cancelled"].includes(String(status).toLowerCase())) {
    console.error("Self-Healing failed. Collector ID still valid:", COLLECTOR);
    process.exit(1);
  }
}

console.log("Still running (can take up to 15 minutes). Collector ID:", COLLECTOR);
console.log("Check email from Bright Data or the Scraper Studio IDE.");
