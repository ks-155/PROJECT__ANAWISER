/**
 * Copy D:\dataset_1 and D:\Dataset_2 into the Anawiser project:
 *   - public/datasets/          (served on the website)
 *   - data/datasets-backup/     (local backup if you add new items)
 * Then write src/lib/dataset-manifest.json for catalog photos + AI training.
 *
 * Re-run after dropping new files on D:\:  npm run datasets:sync
 */

import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public", "datasets");
const backupDir = join(root, "data", "datasets-backup");
const manifestPath = join(root, "src", "lib", "dataset-manifest.json");

const SOURCES = [
  { name: "dataset_1", paths: ["D:\\dataset_1"] },
  { name: "dataset_2", paths: ["D:\\Dataset_2", "D:\\dataset_2"] },
];

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".avif"]);
const LABEL_EXT = new Set([".xml", ".json", ".csv", ".txt", ".yaml", ".yml"]);

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function copyInto(fromRoot, destRoot) {
  const files = walk(fromRoot);
  for (const file of files) {
    const rel = relative(fromRoot, file);
    const dest = join(destRoot, rel);
    ensureDir(dirname(dest));
    copyFileSync(file, dest);
  }
  return files.length;
}

function parseXmlLabels(xml) {
  const names = [...xml.matchAll(/<name>\s*([^<]+)\s*<\/name>/gi)].map((m) => m[1].trim());
  return [...new Set(names.filter((n) => n && n.toLowerCase() !== "unspecified"))];
}

function labelMapFromXml(files, fromRoot) {
  const map = new Map();
  for (const file of files) {
    if (extname(file).toLowerCase() !== ".xml") continue;
    const labels = parseXmlLabels(readFileSync(file, "utf8"));
    const stem = basename(file, ".xml");
    map.set(stem, labels);
    const imgName = xmlFilename(file);
    if (imgName) map.set(basename(imgName, extname(imgName)), labels);
  }
  return map;
}

function xmlFilename(file) {
  const xml = readFileSync(file, "utf8");
  const m = xml.match(/<filename>\s*([^<]+)\s*<\/filename>/i);
  return m ? m[1].trim() : null;
}

const found = [];
const missing = [];
const images = [];
const labelSet = new Set();

for (const source of SOURCES) {
  const from = source.paths.find((p) => existsSync(p));
  if (!from) {
    missing.push(source.name);
    continue;
  }
  const count = copyInto(from, join(backupDir, source.name));
  copyInto(from, join(publicDir, source.name));
  const files = walk(from);
  const labelsByStem = labelMapFromXml(files, from);

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!IMAGE_EXT.has(ext)) {
      for (const label of labelsByStem.get(basename(file, ext)) || []) labelSet.add(label);
      continue;
    }
    const rel = relative(from, file).replaceAll("\\", "/");
    const stem = basename(file, ext);
    const labels = labelsByStem.get(stem)?.length
      ? labelsByStem.get(stem)
      : guessLabels(source.name, rel);
    labels.forEach((l) => labelSet.add(l));
    images.push({
      id: createHash("sha1").update(`${source.name}/${rel}`).digest("hex").slice(0, 12),
      source: source.name,
      file: rel,
      url: `/datasets/${source.name}/${rel}`,
      labels,
    });
  }

  found.push({ name: source.name, from, files: files.length, photos: images.filter((i) => i.source === source.name).length });
}

function guessLabels(source, rel) {
  const parts = rel.replaceAll("\\", "/").toLowerCase().split("/").filter(Boolean);
  const folders = parts
    .slice(0, -1)
    .filter((p) => !["images", "annotations", "ecommerce products"].includes(p));
  const labels = [...folders];
  const text = `${source} ${rel}`.toLowerCase();
  if (text.includes("phone")) labels.push("phone");
  if (text.includes("bag") || text.includes("luggage")) labels.push("bag");
  if (text.includes("protein") || text.includes("food")) labels.push("food");
  if (text.includes("tshirt") || text.includes("t-shirt")) labels.push("tshirt");
  if (text.includes("jean")) labels.push("jeans");
  if (text.includes("sofa")) labels.push("sofa");
  if (/\btv\b/.test(text) || text.includes("television")) labels.push("tv");
  return [...new Set(labels.length ? labels : [source])];
}

const manifest = {
  generatedAt: new Date().toISOString(),
  sources: found,
  missing,
  backupDir: "data/datasets-backup",
  publicDir: "public/datasets",
  photoCount: images.length,
  labels: [...labelSet].sort(),
  photos: images,
};

ensureDir(dirname(manifestPath));
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`Synced ${images.length} photos.`);
for (const s of found) console.log(`  ${s.name}: ${s.photos} photos from ${s.from}`);
if (missing.length) console.log(`  missing on disk: ${missing.join(", ")}`);
console.log(`Backup: ${backupDir}`);
console.log(`Web:    ${publicDir}`);
console.log(`Index:  ${manifestPath}`);
console.log("Re-run `npm run datasets:sync` after you add new items on D:\\");
