"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, LoaderCircle, MapPin, RefreshCw } from "lucide-react";
import { ChatContextBridge } from "./chat-context-bridge";
import { CATALOG, CATEGORIES, CategoryName, CatalogProduct, Platform } from "@/lib/catalog";
import { galleryForProduct, imageForProduct } from "@/lib/product-images";
import { festivalHeadline, shopperOffers, cleanCoupon } from "@/lib/offers";

const PLATFORM_LABEL: Record<string, string> = {
  amazon: "Amazon",
  flipkart: "Flipkart",
  blinkit: "Blinkit",
  croma: "Croma",
  reliance: "Reliance",
  dmart: "D-Mart",
};

const PLATFORMS: Platform[] = ["amazon", "flipkart", "blinkit", "croma", "reliance", "dmart"];
const LS_CATEGORY = "anawiser_selected_category";
const LS_PRODUCT = "anawiser_selected_product";
const fieldClass = "field-ghost";

type PriceEntry = {
  price: number | null;
  status: string;
  mrp?: number | null;
  discountPercent?: number | null;
  coupon?: string | null;
  offers?: string[];
};

type LocalRow = {
  id: string;
  attributes?: { storeName?: string; couponCode?: string; festivalNote?: string };
  latest?: { price?: number | null };
  desiredPrice?: number | null;
};

function rupees(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function CompareIdeaPanel() {
  return (
    <aside className="glass p-7 md:sticky md:top-8 md:p-8">
      <h2 className="text-4xl font-semibold leading-tight md:text-5xl">How it works</h2>
      <p className="mt-4 text-base leading-relaxed text-white/80">
        Pick a product. We line up big websites and a nearby shop. You buy the cheaper one.
      </p>
      <ol className="mt-8 space-y-5 text-base text-white/85">
        <li>
          <span className="block text-sm font-medium text-[var(--accent)]">1. Choose</span>
          Category, then product.
        </li>
        <li>
          <span className="block text-sm font-medium text-[var(--accent)]">2. Compare</span>
          Amazon, Flipkart, and more in one list.
        </li>
        <li>
          <span className="block text-sm font-medium text-[var(--accent)]">3. Decide</span>
          If a local shop is lower, walk there.
        </li>
      </ol>
      <div className="mt-8 rounded-2xl border border-[#ff8a3d]/25 bg-black/30 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-white/45">Example</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex justify-between text-white/70">
            <span>Amazon</span>
            <span>₹79,999</span>
          </li>
          <li className="flex justify-between text-white/70">
            <span>Flipkart</span>
            <span>₹78,490</span>
          </li>
          <li className="flex justify-between text-[var(--accent)]">
            <span>Nearby shop</span>
            <span className="font-semibold">₹77,900</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}

function CompareAnalytics({
  productName,
  rows,
}: {
  productName: string;
  rows: Array<{ platform: string; price: number }>;
}) {
  const stats = useMemo(() => {
    if (!rows.length) return null;
    const min = Math.min(...rows.map((r) => r.price));
    const max = Math.max(...rows.map((r) => r.price));
    const span = max - min || 1;
    const heat = rows.map((r) => ({ ...r, heat: 0.4 + (max - r.price) / span }));
    const heatSum = heat.reduce((sum, r) => sum + r.heat, 0);
    const ranked = heat
      .map((r) => ({
        platform: r.platform,
        price: r.price,
        pull: Math.round((r.heat / heatSum) * 100),
      }))
      .sort((a, b) => a.price - b.price);
    const points = PLATFORMS.map((platform) => rows.find((r) => r.platform === platform)?.price).filter(
      (n): n is number => typeof n === "number",
    );
    return { min, max, ranked, points };
  }, [rows]);

  if (!stats) {
    return (
      <aside className="glass p-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">Store mix</p>
        <h3 className="mt-2 text-lg font-semibold">Price &amp; pull</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          After prices load, this panel shows how today&apos;s quotes sit across Amazon, Flipkart,
          Blinkit, Croma, Reliance, and D-Mart.
        </p>
      </aside>
    );
  }

  const width = 220;
  const height = 72;
  const path = stats.points
    .map((price, index) => {
      const x = stats.points.length === 1 ? width / 2 : (index / (stats.points.length - 1)) * width;
      const y = height - 8 - ((price - stats.min) / (stats.max - stats.min || 1)) * (height - 16);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <aside className="glass p-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">Store mix</p>
      <h3 className="mt-2 text-lg font-semibold">Price &amp; pull</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/65">
        How {productName} is priced across the stores we cover, and where the deal is strongest today.
      </p>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-5 h-16 w-full text-[var(--accent)]" aria-hidden>
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <p className="mt-1 text-[11px] text-white/45">
        Spread {rupees(stats.min)} – {rupees(stats.max)}
      </p>
      <div className="mt-5 space-y-3">
        {stats.ranked.map((row) => (
          <div key={row.platform}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/85">{PLATFORM_LABEL[row.platform]}</span>
              <span className="text-white/55">{row.pull}% pull</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.max(8, row.pull)}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-white/45">{rupees(row.price)} live</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11px] leading-relaxed text-white/40">
        Pull is from today&apos;s quotes: a lower price on a store gets a larger share.
      </p>
    </aside>
  );
}

export function AnawiserDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | "">("");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [prices, setPrices] = useState<Record<string, PriceEntry>>({});
  const [localPrices, setLocalPrices] = useState<LocalRow[]>([]);
  const [loadingLocal, setLoadingLocal] = useState(false);

  const products = CATALOG.filter((item) => item.category === selectedCategory);
  const photo = imageForProduct(selectedProduct);
  const gallery = galleryForProduct(selectedProduct, 4);
  const hasStoreUrls = Object.values(selectedProduct?.urls || {}).some(Boolean);
  const festival = festivalHeadline();

  const fetchOnlinePrices = useCallback(async (product: CatalogProduct) => {
    if (!Object.values(product.urls || {}).some(Boolean)) {
      setPrices({});
      return;
    }
    setLoadingPrices(true);
    setPrices({});
    try {
      const res = await fetch("/api/anawiser/scrape-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, urls: product.urls }),
        signal: AbortSignal.timeout(12000),
      });
      const data = await res.json();
      const raw = (data.results || {}) as Record<string, PriceEntry>;
      setPrices(
        Object.fromEntries(
          Object.entries(raw).map(([platform, entry]) => [
            platform,
            {
              price: entry.price ?? null,
              status: entry.status ?? "",
              mrp: entry.mrp ?? null,
              discountPercent: entry.discountPercent ?? null,
              coupon: cleanCoupon(entry.coupon),
              offers: shopperOffers(entry.offers),
            },
          ]),
        ),
      );
    } catch (err) {
      console.error("Failed to fetch online prices", err);
    } finally {
      setLoadingPrices(false);
    }
  }, []);

  useEffect(() => {
    const savedCategory = localStorage.getItem(LS_CATEGORY) as CategoryName | null;
    const savedProductId = localStorage.getItem(LS_PRODUCT);
    if (!savedCategory) return;
    setSelectedCategory(savedCategory);
    if (!savedProductId) return;
    const product = CATALOG.find((item) => item.id === savedProductId);
    if (!product) return;
    setSelectedProduct(product);
    void fetchOnlinePrices(product);
  }, [fetchOnlinePrices]);

  useEffect(() => {
    if (selectedCategory) localStorage.setItem(LS_CATEGORY, selectedCategory);
    else localStorage.removeItem(LS_CATEGORY);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedProduct) localStorage.setItem(LS_PRODUCT, selectedProduct.id);
    else localStorage.removeItem(LS_PRODUCT);
  }, [selectedProduct]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value as CategoryName);
    setSelectedProduct(null);
    setPrices({});
    setLocalPrices([]);
  };

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const product = CATALOG.find((item) => item.id === event.target.value) || null;
    setSelectedProduct(product);
    setLocalPrices([]);
    if (product) void fetchOnlinePrices(product);
  };

  const fetchLocalStoresPrice = async () => {
    if (!selectedProduct) return;
    setLoadingLocal(true);
    try {
      const res = await fetch(
        `/api/anawiser/local-prices?productName=${encodeURIComponent(selectedProduct.name)}`,
      );
      const data = await res.json();
      setLocalPrices(data.products || []);
    } catch (err) {
      console.error("Failed to fetch local prices", err);
    } finally {
      setLoadingLocal(false);
    }
  };

  const validPrices = Object.entries(prices)
    .filter(([, entry]) => entry.price !== null)
    .map(([platform, entry]) => ({ platform, price: entry.price as number }));
  const bestDeal = validPrices.length
    ? validPrices.reduce((left, right) => (left.price < right.price ? left : right))
    : null;
  const avgPrice = validPrices.length
    ? Math.round(validPrices.reduce((sum, row) => sum + row.price, 0) / validPrices.length)
    : null;
  const saved = bestDeal && avgPrice ? avgPrice - bestDeal.price : 0;

  return (
    <>
      <main className="min-w-0 px-6 py-10 md:px-12">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0">
            <p className="text-sm text-white/70">Compare</p>
            <p className="tagline-display mt-3 text-2xl text-white/90 md:text-4xl">
              Find Best Prices across all major E-Commerce
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">Find the lowest price</h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--text-muted)]">
              One check across Amazon, Flipkart, Blinkit, Croma, Reliance, D-Mart, and nearby shops.
              During festival sales we surface public discount chips so you can pick store or app.
            </p>

            <div className="glass mt-8 p-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">Festival &amp; offers</p>
              <p className="mt-2 text-lg font-semibold text-white">{festival.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{festival.detail}</p>
            </div>

            <div className="glass mt-8 space-y-5 p-8">
              <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">Category</label>
              <select className={fieldClass} value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">-- Choose a category --</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {selectedCategory ? (
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">Product</label>
                  <select className={fieldClass} value={selectedProduct?.id || ""} onChange={handleProductChange}>
                    <option value="">-- Choose a product --</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
          </div>

          <CompareIdeaPanel />
        </div>

        {selectedProduct ? (
          <div className="mt-10 grid items-start gap-8 xl:grid-cols-[minmax(0,1.35fr)_22rem]">
            <div className="space-y-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                {gallery.length ? (
                  <div className="w-full max-w-md shrink-0">
                    <div className="glass overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={gallery[0].url} alt={selectedProduct.name} className="h-64 w-full object-cover sm:h-80" />
                    </div>
                    {gallery.length > 1 ? (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {gallery.slice(1).map((shot) => (
                          <div key={shot.id} className="glass overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={shot.url} alt="" className="h-24 w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : photo ? (
                  <div className="glass h-64 w-64 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={selectedProduct.name} className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h2 className="text-2xl font-semibold text-[var(--text)]">{selectedProduct.name}</h2>
                    {hasStoreUrls ? (
                      <button
                        type="button"
                        onClick={() => void fetchOnlinePrices(selectedProduct)}
                        disabled={loadingPrices}
                        className="flex items-center gap-2 text-sm font-medium text-[var(--accent)] disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 ${loadingPrices ? "animate-spin" : ""}`} />
                        {loadingPrices ? "Refreshing…" : "Refresh Prices"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              {!loadingPrices && validPrices.length > 0 ? (
                <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Lowest today</p>
                    <p className="mt-1 text-3xl font-semibold text-[var(--text)]">
                      {bestDeal ? rupees(bestDeal.price) : "—"}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">{PLATFORM_LABEL[bestDeal?.platform || ""]}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Typical online</p>
                    <p className="mt-1 text-3xl font-semibold text-[var(--text)]">
                      {avgPrice ? rupees(avgPrice) : "—"}
                    </p>
                  </div>
                  {saved > 0 ? (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">You keep</p>
                      <p className="mt-1 text-3xl font-semibold text-[var(--text)]">{rupees(saved)}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {loadingPrices ? (
                <div className="flex items-center gap-3 py-8">
                  <LoaderCircle className="h-6 w-6 animate-spin text-[var(--accent)]" />
                  <p className="text-[var(--text-muted)]">Checking public prices…</p>
                </div>
              ) : hasStoreUrls ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {PLATFORMS.map((platform) => {
                    const url = selectedProduct.urls[platform];
                    if (!url) return null;
                    const entry = prices[platform];
                    const isBest = bestDeal?.platform === platform;
                    const offers = shopperOffers(entry?.offers);
                    return (
                      <div key={platform}>
                        {isBest ? (
                          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[var(--accent)]">
                            Best price
                          </p>
                        ) : null}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[var(--text)]">{PLATFORM_LABEL[platform]}</span>
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)]">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        {!entry ? (
                          <p className="text-sm text-[var(--text-muted)]">Checking…</p>
                        ) : entry.price ? (
                          <div>
                            <p className="text-2xl font-semibold text-[var(--text)]">{rupees(entry.price)}</p>
                            {entry.mrp && entry.mrp > entry.price ? (
                              <p className="text-xs text-white/50">
                                MRP {rupees(entry.mrp)}
                                {entry.discountPercent ? ` · ${entry.discountPercent}% off` : ""}
                              </p>
                            ) : null}
                            {cleanCoupon(entry.coupon) ? (
                              <p className="mt-1 text-xs font-medium text-[var(--accent)]">
                                Code {cleanCoupon(entry.coupon)}
                              </p>
                            ) : null}
                            {offers.length ? (
                              <ul className="mt-2 space-y-1 text-xs text-white/60">
                                {offers.map((offer) => (
                                  <li key={offer}>{offer}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        ) : (
                          <p className="text-sm text-[var(--text-muted)]">{entry.status}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">
                  Publish a neighbourhood rate below while live storefront links are added.
                </p>
              )}

              <div>
                <div className="mb-4 flex flex-wrap items-center gap-4">
                  <h3 className="text-xl font-semibold text-[var(--text)]">Nearby shops</h3>
                  <button
                    type="button"
                    onClick={() => void fetchLocalStoresPrice()}
                    disabled={loadingLocal}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/50 bg-[var(--accent)]/15 px-5 py-2.5 text-base font-semibold text-[var(--accent)] disabled:opacity-50 md:text-lg"
                  >
                    {loadingLocal ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
                    {loadingLocal ? "Checking…" : "Check local stores"}
                  </button>
                </div>
                {localPrices.length > 0 ? (
                  <ul className="space-y-3">
                    {localPrices.map((row) => (
                      <li key={row.id} className="flex justify-between gap-4 text-sm">
                        <span className="text-[var(--text)]">
                          {row.attributes?.storeName || "Local store"}
                          {cleanCoupon(row.attributes?.couponCode) ? (
                            <span className="mt-1 block text-xs text-[var(--accent)]">
                              Code {cleanCoupon(row.attributes?.couponCode)}
                            </span>
                          ) : null}
                          {row.attributes?.festivalNote ? (
                            <span className="mt-1 block text-xs text-white/55">{row.attributes.festivalNote}</span>
                          ) : null}
                        </span>
                        <span className="text-[var(--text)]">
                          {row.latest?.price != null ? rupees(row.latest.price) : "N/A"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">
                    {loadingLocal ? "Checking nearby shops…" : "See if a local shop beats the internet price."}
                  </p>
                )}
              </div>
            </div>

            <CompareAnalytics productName={selectedProduct.name} rows={validPrices} />
          </div>
        ) : null}
      </main>

      <ChatContextBridge
        productName={selectedProduct?.name}
        category={selectedCategory || undefined}
        prices={prices}
        localPrices={localPrices.map((row) => ({
          store: row.attributes?.storeName || "Local store",
          price: row.latest?.price ?? row.desiredPrice ?? null,
        }))}
      />
    </>
  );
}
