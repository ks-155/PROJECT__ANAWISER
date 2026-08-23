"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import {
  LoaderCircle, MapPin, RefreshCw, TrendingDown, TrendingUp,
  Minus, ExternalLink, ShieldCheck, Zap, Award
} from "lucide-react";
import { Sidebar } from "./sidebar";
import { AiAssistantPanel } from "./ai-assistant";
import { CATALOG, CATEGORIES, CategoryName, CatalogProduct, Platform } from "@/lib/catalog";

const Anawiser3DBackground = dynamic(
  () => import("./anawiser-3d-background").then((m) => m.Anawiser3DBackground),
  { ssr: false },
);

const PLATFORM_META: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  flipkart:  { label: "Flipkart",  color: "#2874f0", bg: "#eef3ff", dot: "bg-blue-600" },
  amazon:    { label: "Amazon",    color: "#f90",    bg: "#fff8ee", dot: "bg-amber-500" },
  blinkit:   { label: "Blinkit",   color: "#f8cf00", bg: "#fffde7", dot: "bg-yellow-400" },
  croma:     { label: "Croma",     color: "#008000", bg: "#edfaed", dot: "bg-green-700" },
  reliance:  { label: "Reliance",  color: "#d63031", bg: "#fff0f0", dot: "bg-red-600" },
  dmart:     { label: "D-Mart",    color: "#e2001a", bg: "#fff0f1", dot: "bg-rose-600" },
};

const LS_CATEGORY_KEY = "anawiser_selected_category";
const LS_PRODUCT_KEY  = "anawiser_selected_product";
const fieldClass =
  "w-full rounded-xl border border-slate-300/90 bg-white/50 px-4 py-3 text-[15px] font-medium text-ink shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-300/50";

type PriceEntry = { price: number | null; status: string };

export function AnawiserDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | "">("");
  const [selectedProduct,  setSelectedProduct]  = useState<CatalogProduct | null>(null);
  const [loadingPrices,    setLoadingPrices]    = useState(false);
  const [prices,           setPrices]           = useState<Record<string, PriceEntry>>({});
  const [localPrices,      setLocalPrices]      = useState<any[]>([]);
  const [loadingLocal,     setLoadingLocal]     = useState(false);
  const [lastUpdated,      setLastUpdated]      = useState<Date | null>(null);

  const products = CATALOG.filter((p) => p.category === selectedCategory);
  const platforms: Platform[] = ["flipkart", "amazon", "blinkit", "croma", "reliance", "dmart"];

  // ── Restore from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    const savedCategory = localStorage.getItem(LS_CATEGORY_KEY) as CategoryName | null;
    const savedProductId = localStorage.getItem(LS_PRODUCT_KEY);
    if (savedCategory) {
      setSelectedCategory(savedCategory);
      if (savedProductId) {
        const prod = CATALOG.find((p) => p.id === savedProductId);
        if (prod) {
          setSelectedProduct(prod);
          fetchOnlinePrices(prod);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist selections to localStorage ──────────────────────────────────
  useEffect(() => {
    if (selectedCategory) localStorage.setItem(LS_CATEGORY_KEY, selectedCategory);
    else localStorage.removeItem(LS_CATEGORY_KEY);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedProduct) localStorage.setItem(LS_PRODUCT_KEY, selectedProduct.id);
    else localStorage.removeItem(LS_PRODUCT_KEY);
  }, [selectedProduct]);

  // ── Live price fetching ─────────────────────────────────────────────────
  const fetchOnlinePrices = useCallback(async (product: CatalogProduct) => {
    setLoadingPrices(true);
    setPrices({});
    try {
      const res = await fetch("/api/anawiser/scrape-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, urls: product.urls }),
      });
      const data = await res.json();
      setPrices(data.results || {});
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch online prices", err);
    } finally {
      setLoadingPrices(false);
    }
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as CategoryName);
    setSelectedProduct(null);
    setPrices({});
    setLocalPrices([]);
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prod = CATALOG.find((p) => p.id === e.target.value) || null;
    setSelectedProduct(prod);
    setLocalPrices([]);
    if (prod) fetchOnlinePrices(prod);
  };

  const fetchLocalStoresPrice = async () => {
    if (!selectedProduct) return;
    setLoadingLocal(true);
    try {
      const res = await fetch(`/api/anawiser/local-prices?productName=${encodeURIComponent(selectedProduct.name)}`);
      const data = await res.json();
      setLocalPrices(data.products || []);
    } catch (err) {
      console.error("Failed to fetch local prices", err);
    } finally {
      setLoadingLocal(false);
    }
  };

  // ── Derived computations ─────────────────────────────────────────────────
  const validPrices = Object.entries(prices)
    .filter(([, v]) => v.price !== null)
    .map(([k, v]) => ({ platform: k, price: v.price as number }));

  const bestDeal = validPrices.length
    ? validPrices.reduce((a, b) => (a.price < b.price ? a : b))
    : null;

  const avgPrice = validPrices.length
    ? Math.round(validPrices.reduce((s, v) => s + v.price, 0) / validPrices.length)
    : null;

  return (
    <div className="relative flex min-h-screen bg-transparent font-sans text-ink">
      <Anawiser3DBackground />

      <div className="relative z-10 flex min-h-screen w-full">
        <Sidebar />

        <main className="max-w-5xl flex-1 px-8 py-10 md:px-12 md:py-12">
          {/* Header Panel */}
          <header className="panel-frost mb-10 max-w-xl rounded-2xl p-7 animate-in">
            <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">
              Price radar
            </p>
            <h1 className="heading-strong font-display text-3xl md:text-4xl">
              Welcome to Anawiser
            </h1>
            <p className="text-super mt-3 max-w-md text-[16px] text-slate-800">
              Compare online and local store prices for the products you care about.
            </p>
          </header>

          {/* Selector Panel */}
          <div className="panel-frost mb-10 max-w-xl space-y-5 rounded-2xl p-7 animate-in">
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">
                Select category of products
              </label>
              <select
                className={fieldClass}
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">-- Choose a category --</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory && (
              <div>
                <label className="mb-2 block text-sm font-bold text-ink">
                  Select product
                </label>
                <select
                  className={fieldClass}
                  value={selectedProduct?.id || ""}
                  onChange={handleProductChange}
                >
                  <option value="">-- Choose a product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Pricing Content */}
          {selectedProduct && (
            <div className="panel-frost mb-10 space-y-6 rounded-2xl p-7 animate-in">
              {/* Product title bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedProduct.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lastUpdated
                      ? `Last updated: ${lastUpdated.toLocaleTimeString()} — via Bright Data`
                      : "Fetching live prices…"}
                  </p>
                </div>
                <button
                  id="refresh-prices"
                  onClick={() => fetchOnlinePrices(selectedProduct)}
                  disabled={loadingPrices}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-white hover:border-indigo-400 transition disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingPrices ? "animate-spin" : ""}`} />
                  {loadingPrices ? "Refreshing…" : "Refresh Prices"}
                </button>
              </div>

              {/* Summary stats */}
              {!loadingPrices && validPrices.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Best Deal */}
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wide">
                      <Award className="h-4 w-4" /> Best Deal
                    </div>
                    <p className="text-2xl font-bold text-emerald-800">
                      ₹{bestDeal?.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-emerald-600 capitalize">{PLATFORM_META[bestDeal?.platform || ""]?.label}</p>
                  </div>

                  {/* Average Price */}
                  <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-5 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold uppercase tracking-wide">
                      <Minus className="h-4 w-4" /> Avg. Online Price
                    </div>
                    <p className="text-2xl font-bold text-blue-800">₹{avgPrice?.toLocaleString("en-IN")}</p>
                    <p className="text-sm text-blue-500">{validPrices.length} platforms checked</p>
                  </div>

                  {/* Savings vs avg */}
                  {bestDeal && avgPrice && (
                    <div className="bg-violet-50/80 border border-violet-200 rounded-2xl p-5 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-violet-700 text-xs font-semibold uppercase tracking-wide">
                        <TrendingDown className="h-4 w-4" /> Save vs Avg
                      </div>
                      <p className="text-2xl font-bold text-violet-800">
                        ₹{(avgPrice - bestDeal.price).toLocaleString("en-IN")}
                      </p>
                      <p className="text-sm text-violet-500">by choosing {PLATFORM_META[bestDeal.platform]?.label}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Platform Price Cards */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-widest mb-4 mt-6">Live Prices by Platform</h3>

                {loadingPrices ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 bg-white/50 rounded-2xl border border-slate-200">
                    <LoaderCircle className="h-8 w-8 animate-spin text-violet-600" />
                    <div className="text-center">
                      <p className="font-medium text-slate-700">Fetching live prices…</p>
                      <p className="text-sm text-slate-500 mt-1">Bypassing bot protection via Bright Data Web Unlocker</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {platforms.map((platform) => {
                      const url = selectedProduct.urls[platform];
                      if (!url) return null;

                      const entry = prices[platform];
                      const meta = PLATFORM_META[platform];
                      const isBest = bestDeal?.platform === platform;
                      const priceDiff = (entry?.price && avgPrice) ? entry.price - avgPrice : null;

                      return (
                        <div
                          key={platform}
                          className={`relative bg-white/70 rounded-2xl border shadow-sm p-5 flex flex-col gap-3 transition hover:shadow-md hover:bg-white
                            ${isBest ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-200"}`}
                        >
                          {isBest && (
                            <div className="absolute -top-3 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" /> Best Price
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: meta?.color }}
                              />
                              <span className="font-semibold text-slate-700 text-sm">{meta?.label}</span>
                            </div>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-violet-600 transition"
                              title={`View on ${meta?.label}`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>

                          <div>
                            {!entry ? (
                              <p className="text-slate-400 text-sm font-medium">Checking…</p>
                            ) : entry.price ? (
                              <div className="flex items-end gap-2">
                                <p className="text-2xl font-bold text-slate-900">
                                  ₹{entry.price.toLocaleString("en-IN")}
                                </p>
                                {priceDiff !== null && (
                                  <span className={`text-[11px] font-bold mb-1 flex items-center gap-0.5
                                    ${priceDiff < 0 ? "text-emerald-600" : priceDiff > 0 ? "text-red-500" : "text-slate-400"}`}
                                  >
                                    {priceDiff < 0 ? <TrendingDown className="h-3 w-3" /> : priceDiff > 0 ? <TrendingUp className="h-3 w-3" /> : null}
                                    {priceDiff < 0 ? `-₹${Math.abs(priceDiff).toLocaleString("en-IN")}` : priceDiff > 0 ? `+₹${priceDiff.toLocaleString("en-IN")}` : "Avg"}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <p className="text-rose-500 text-sm font-medium">{entry.status}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Local Store Section */}
              <div className="mt-8 pt-8 border-t border-slate-200/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-widest">Nearby Local Stores</h3>
                  <button
                    id="check-local-prices"
                    onClick={fetchLocalStoresPrice}
                    disabled={loadingLocal}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 via-cyan-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-50"
                  >
                    {loadingLocal ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                    {loadingLocal ? "Checking…" : "Check Local Stores"}
                  </button>
                </div>

                {localPrices.length > 0 ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/50">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50/50">
                        <tr className="border-b border-slate-200">
                          <th className="text-left text-slate-500 font-semibold py-2.5 px-4">Store Name</th>
                          <th className="text-left text-slate-500 font-semibold py-2.5 px-4 hidden md:table-cell">Location</th>
                          <th className="text-right text-slate-500 font-semibold py-2.5 px-4">Price</th>
                          <th className="text-right text-slate-500 font-semibold py-2.5 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {localPrices.map((lp) => (
                          <tr key={lp.id} className="hover:bg-white/80 transition">
                            <td className="py-3 px-4 font-bold text-slate-800">
                              {lp.attributes?.storeName || "Local Store"}
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">
                              {lp.attributes?.storeAddress || "—"}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                              ₹{lp.latest?.price?.toLocaleString("en-IN") || "N/A"}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                In Stock
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic text-center py-4 bg-white/30 rounded-xl border border-slate-100">
                    {!loadingLocal ? "Click the button above to check local store availability." : "Fetching local availability..."}
                  </p>
                )}
              </div>

            </div>
          )}
        </main>
      </div>

      <AiAssistantPanel
        category={selectedCategory || undefined}
        productName={selectedProduct?.name}
        prices={prices}
        localPrices={localPrices.map((lp) => ({
          store: lp.attributes?.storeName || "Local Store",
          price: lp.latest?.price ?? lp.desiredPrice ?? null,
        }))}
      />
    </div>
  );
}
