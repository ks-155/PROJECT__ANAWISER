import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Product = {
  id: string;
  url: string;
  name?: string;
  desiredPrice: number | null;
  attributes: Record<string, string>;
  active: boolean;
  createdAt: string;
};

export type Snapshot = {
  id: string;
  productId: string;
  timestamp: string;
  price: number | null;
  inStock: boolean;
  currency?: string;
  stockText?: string;
};

let client: SupabaseClient | null = null;

function db() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  client = createClient(url, key);
  return client;
}

function id(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function toProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    url: String(row.url),
    name: row.name ? String(row.name) : undefined,
    desiredPrice: (row.desired_price as number | null) ?? null,
    attributes: (row.attributes as Record<string, string>) || {},
    active: Boolean(row.active),
    createdAt: String(row.created_at),
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await db()
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(toProduct);
}

export async function addProduct(
  product: Omit<Product, "id" | "createdAt" | "active">,
): Promise<Product> {
  const { data: existing } = await db().from("products").select("id").eq("url", product.url).limit(1);
  if (existing?.length) throw new Error("This product URL is already tracked");

  const now = new Date().toISOString();
  const row = {
    id: id("prod"),
    url: product.url,
    name: product.name || null,
    desired_price: product.desiredPrice,
    attributes: product.attributes || {},
    active: true,
    created_at: now,
  };
  const { error } = await db().from("products").insert(row);
  if (error) throw new Error(error.message);
  return toProduct(row);
}

export async function getLatestSnapshot(productId: string): Promise<Snapshot | null> {
  const { data, error } = await db()
    .from("snapshots")
    .select("*")
    .eq("product_id", productId)
    .order("timestamp", { ascending: false })
    .limit(1);
  if (error) throw new Error(error.message);
  const row = data?.[0];
  if (!row) return null;
  return {
    id: row.id,
    productId: row.product_id,
    timestamp: row.timestamp,
    price: row.price,
    inStock: row.in_stock,
    currency: row.currency,
    stockText: row.stock_text,
  };
}

export async function addSnapshot(
  snapshot: Omit<Snapshot, "id" | "timestamp">,
): Promise<Snapshot> {
  const now = new Date().toISOString();
  const row = {
    id: id("snap"),
    product_id: snapshot.productId,
    timestamp: now,
    price: snapshot.price,
    in_stock: snapshot.inStock,
    currency: snapshot.currency || "INR",
    stock_text: snapshot.stockText,
  };
  const { error } = await db().from("snapshots").insert(row);
  if (error) throw new Error(error.message);
  return {
    id: row.id,
    productId: snapshot.productId,
    timestamp: now,
    price: snapshot.price,
    inStock: snapshot.inStock,
    currency: row.currency,
    stockText: snapshot.stockText,
  };
}
