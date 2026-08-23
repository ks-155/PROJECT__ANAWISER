/**
 * Keep catalog photos online so they cannot vanish on deploy.
 *
 * Default: files in public/datasets/ go out with the Vercel CDN on every deploy.
 * Optional second copy (object storage, not Postgres binaries):
 *   - SUPABASE_SERVICE_ROLE_KEY → public bucket catalog-photos
 *   - BLOB_READ_WRITE_TOKEN → Vercel Blob
 *
 *   cd frontend
 *   npm run datasets:publish
 *
 * Google Drive is not used. It is not a website CDN.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public", "datasets");
const envPath = join(root, ".env.local");
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".avif"]);
const BUCKET = "catalog-photos";

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (IMAGE_EXT.has(extname(full).toLowerCase())) acc.push(full);
  }
  return acc;
}

function contentType(file) {
  const ext = extname(file).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".avif") return "image/avif";
  if (ext === ".bmp") return "image/bmp";
  return "image/jpeg";
}

const files = walk(publicDir);
const bytes = files.reduce((n, f) => n + statSync(f).size, 0);
console.log(`Local Vercel copy: ${files.length} photos in public/datasets (${Math.round(bytes / 1e6)} MB)`);
if (!files.length) {
  console.error("No photos found. Run npm run datasets:sync first.");
  process.exit(1);
}

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || "";

async function publishSupabase() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => null);
  await supabase.storage.updateBucket(BUCKET, { public: true }).catch(() => null);
  let ok = 0;
  for (const file of files) {
    const path = relative(publicDir, file).replaceAll("\\", "/");
    const body = readFileSync(file);
    const { error } = await supabase.storage.from(BUCKET).upload(path, body, {
      contentType: contentType(file),
      upsert: true,
    });
    if (error) {
      console.error(`Failed ${path}: ${error.message}`);
      process.exit(1);
    }
    ok += 1;
    if (ok % 50 === 0) console.log(`  uploaded ${ok}/${files.length}`);
  }
  const cdn = `${supabaseUrl}/storage/v1/object/public/${BUCKET}`;
  console.log(`Supabase Storage copy ready (${ok} files).`);
  console.log(`Set NEXT_PUBLIC_DATASET_CDN=${cdn}`);
}

async function publishBlob() {
  const { put } = await import("@vercel/blob");
  let ok = 0;
  let prefix = "";
  for (const file of files) {
    const path = relative(publicDir, file).replaceAll("\\", "/");
    const blob = await put(`datasets/${path}`, readFileSync(file), {
      access: "public",
      token: blobToken,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    if (!prefix) {
      const idx = blob.url.indexOf("/datasets/");
      prefix = idx >= 0 ? blob.url.slice(0, idx) : new URL(blob.url).origin;
    }
    ok += 1;
    if (ok % 50 === 0) console.log(`  uploaded ${ok}/${files.length}`);
  }
  console.log(`Vercel Blob copy ready (${ok} files).`);
  console.log(`Set NEXT_PUBLIC_DATASET_CDN=${prefix}`);
}

if (serviceKey && supabaseUrl) {
  await publishSupabase();
} else if (blobToken) {
  await publishBlob();
} else {
  console.log("No SUPABASE_SERVICE_ROLE_KEY or BLOB_READ_WRITE_TOKEN — skipping remote copy.");
  console.log("Photos still deploy on Vercel from public/datasets (git + CDN). That is the main copy.");
  console.log("Optional: add SUPABASE_SERVICE_ROLE_KEY and re-run for a Storage backup.");
}
