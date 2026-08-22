import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ── Types (same interface as before, used by engine.ts and API routes) ──

export interface StockProduct {
  id: string;
  url: string;
  desiredPrice: number | null;
  attributes: Record<string, string>;
  active: boolean;
  name?: string;
  createdAt: string;
}

export interface StockSnapshot {
  id: string;
  productId: string;
  timestamp: string;
  price: number | null;
  inStock: boolean;
  currency?: string;
  stockText?: string;
}

// ── Supabase Client (lazy-initialized so build doesn't crash when env vars are missing) ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _supabase: SupabaseClient<any, "public", any> | null = null;

function getSupabase() {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set. " +
      "See docs/EXPLAINER.md for setup instructions."
    );
  }

  _supabase = createClient(supabaseUrl, supabaseKey);
  return _supabase;
}

// ── Helper: Generate a simple unique ID ──

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ── Exported Functions (same signatures as before) ──

/**
 * Get all active products from the database.
 */
export async function getProducts(): Promise<StockProduct[]> {
  const { data, error } = await getSupabase()
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch products: ${error.message}`);

  // Map Supabase snake_case columns to our camelCase interface
  return (data || []).map((row: any) => ({
    id: row.id,
    url: row.url,
    name: row.name,
    desiredPrice: row.desired_price,
    attributes: row.attributes || {},
    active: row.active,
    createdAt: row.created_at,
  }));
}

/**
 * Add a new product to track.
 */
export async function addProduct(
  product: Omit<StockProduct, "id" | "createdAt" | "active">
): Promise<StockProduct> {
  // Check for duplicate URL
  const { data: existing } = await getSupabase()
    .from("products")
    .select("id")
    .eq("url", product.url)
    .limit(1);

  if (existing && existing.length > 0) {
    throw new Error("Product with this URL is already being monitored");
  }

  const id = generateId("prod");
  const now = new Date().toISOString();

  const { error } = await getSupabase().from("products").insert({
    id,
    url: product.url,
    name: product.name || null,
    desired_price: product.desiredPrice,
    attributes: product.attributes || {},
    active: true,
    created_at: now,
  });

  if (error) throw new Error(`Failed to add product: ${error.message}`);

  return {
    id,
    url: product.url,
    name: product.name,
    desiredPrice: product.desiredPrice,
    attributes: product.attributes || {},
    active: true,
    createdAt: now,
  };
}

/**
 * Get the most recent snapshot for a given product.
 */
export async function getLatestSnapshot(
  productId: string
): Promise<StockSnapshot | null> {
  const { data, error } = await getSupabase()
    .from("snapshots")
    .select("*")
    .eq("product_id", productId)
    .order("timestamp", { ascending: false })
    .limit(1);

  if (error) throw new Error(`Failed to fetch snapshot: ${error.message}`);
  if (!data || data.length === 0) return null;

  const row: any = data[0];
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

/**
 * Add a new price/stock snapshot for a product.
 */
export async function addSnapshot(
  snapshot: Omit<StockSnapshot, "id" | "timestamp">
): Promise<StockSnapshot> {
  const id = generateId("snap");
  const now = new Date().toISOString();

  const { error } = await getSupabase().from("snapshots").insert({
    id,
    product_id: snapshot.productId,
    timestamp: now,
    price: snapshot.price,
    in_stock: snapshot.inStock,
    currency: snapshot.currency || "INR",
    stock_text: snapshot.stockText,
  });

  if (error) throw new Error(`Failed to add snapshot: ${error.message}`);

  return {
    id,
    productId: snapshot.productId,
    timestamp: now,
    price: snapshot.price,
    inStock: snapshot.inStock,
    currency: snapshot.currency || "INR",
    stockText: snapshot.stockText,
  };
}
