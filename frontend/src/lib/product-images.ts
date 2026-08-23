import type { CatalogProduct } from "./catalog";
import manifest from "./dataset-manifest.json";

type Photo = {
  id: string;
  source: string;
  file: string;
  url: string;
  labels: string[];
};

const photos = (manifest.photos || []) as Photo[];

function hash(value: string) {
  let h = 0;
  for (const ch of value) h = (Math.imul(31, h) + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function publicAssetUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  const encoded = url
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")
    .replace(/^%2F/, "/");
  const cdn =
    process.env.NEXT_PUBLIC_DATASET_CDN?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_DATASET_CDN?.replace(/\/$/, "") ||
    "";
  if (!cdn) return encoded;
  const path = encoded.replace(/^\/datasets/, "") || encoded;
  return `${cdn}${path.startsWith("/") ? path : `/${path}`}`;
}

function withUrl(photo: Photo): Photo {
  return { ...photo, url: publicAssetUrl(photo.url) };
}

function haystack(photo: Photo) {
  return `${photo.labels.join(" ")} ${photo.file} ${photo.source}`.toLowerCase();
}

function wantedLabels(product: CatalogProduct) {
  const name = `${product.category} ${product.name} ${product.id}`.toLowerCase();
  if (/phone|galaxy|iphone|pixel|oneplus|motorola|redmi/.test(name)) return ["phone"];
  if (/\btv\b|television|led television/.test(name)) return ["tv"];
  if (/jean/.test(name)) return ["jeans", "jean"];
  if (/t-?shirt|tshirt/.test(name)) return ["tshirt", "t-shirt"];
  if (/sofa|couch/.test(name)) return ["sofa"];
  if (/bag|travel|luggage|backpack|tourister|skybags/.test(name)) return ["bag"];
  if (/food|protein|whey|nutrition/.test(name)) return ["food"];
  return [];
}

function poolFor(product: CatalogProduct) {
  const want = wantedLabels(product);
  if (!want.length) return [];
  return photos.filter((p) => {
    const text = haystack(p);
    return want.some((w) => text.includes(w));
  });
}

export function imageForProduct(product: CatalogProduct | null | undefined) {
  if (!product || !photos.length) return null;
  const pool = poolFor(product);
  if (!pool.length) return null;
  return withUrl(pool[hash(product.id) % pool.length] || pool[0]);
}

export function galleryForProduct(product: CatalogProduct | null | undefined, limit = 4) {
  if (!product || !photos.length) return [];
  const pool = poolFor(product);
  if (!pool.length) return [];
  const start = hash(product.id) % pool.length;
  const out: Photo[] = [];
  for (let i = 0; i < Math.min(limit, pool.length); i++) {
    out.push(withUrl(pool[(start + i) % pool.length]));
  }
  return out;
}

function isBlockedHomePhoto(photo: Photo) {
  const text = haystack(photo);
  return /jean|t-?shirt|pants|sofa|ott|netflix|prime\s*video|hotstar|\/tv\//.test(text);
}

function isElectronicsPhoto(photo: Photo) {
  if (isBlockedHomePhoto(photo)) return false;
  const text = haystack(photo);
  if (photo.source === "dataset_1") return true;
  return /phone|laptop|notebook|macbook|electronics/.test(text);
}

export function sampleDatasetPhotos(limit = 8) {
  const pool = photos.filter(isElectronicsPhoto);
  if (!pool.length) return [];
  const step = Math.max(1, Math.floor(pool.length / limit));
  return pool.filter((_, i) => i % step === 0).slice(0, limit).map(withUrl);
}

export function datasetSummary() {
  const labels = [...new Set(photos.flatMap((p) => p.labels))].sort();
  return {
    photoCount: photos.length,
    labels,
    sources: manifest.sources || [],
    missing: manifest.missing || [],
    generatedAt: (manifest.generatedAt as string | null) || null,
  };
}
