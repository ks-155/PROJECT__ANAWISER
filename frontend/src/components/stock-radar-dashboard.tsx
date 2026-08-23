"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, MapPin } from "lucide-react";
import { Sidebar } from "./sidebar";
import { CATALOG, CATEGORIES, CategoryName, CatalogProduct, Platform } from "@/lib/catalog";

export function AnawiserDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | "">("");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [prices, setPrices] = useState<Record<string, { price: number | null; status: string }>>({});
  
  const [localPrices, setLocalPrices] = useState<any[]>([]);
  const [loadingLocal, setLoadingLocal] = useState(false);

  // Available products for the selected category
  const products = CATALOG.filter((p) => p.category === selectedCategory);

  const fetchOnlinePrices = async (product: CatalogProduct) => {
    setLoadingPrices(true);
    setPrices({}); // clear old prices
    
    // We will call the backend API to scrape these platforms
    try {
      const res = await fetch("/api/anawiser/scrape-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, urls: product.urls }),
      });
      const data = await res.json();
      setPrices(data.results || {});
    } catch (err) {
      console.error("Failed to fetch online prices", err);
    } finally {
      setLoadingPrices(false);
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prodId = e.target.value;
    const prod = CATALOG.find((p) => p.id === prodId) || null;
    setSelectedProduct(prod);
    setLocalPrices([]);
    if (prod) {
      fetchOnlinePrices(prod);
    }
  };

  const fetchLocalStoresPrice = async () => {
    if (!selectedProduct) return;
    setLoadingLocal(true);
    try {
      // The backend will query the DB for local products that match this name/category
      const res = await fetch(`/api/anawiser/local-prices?productName=${encodeURIComponent(selectedProduct.name)}`);
      const data = await res.json();
      setLocalPrices(data.products || []);
    } catch (err) {
      console.error("Failed to fetch local prices", err);
    } finally {
      setLoadingLocal(false);
    }
  };

  const platforms: Platform[] = ["flipkart", "blinkit", "croma", "reliance", "dmart", "amazon"];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 p-8 md:p-12 max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 font-display">Welcome to Anawiser!</h1>
        
        <div className="space-y-6 max-w-2xl mb-12">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select category of products</label>
            <select 
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value as CategoryName);
                setSelectedProduct(null);
                setPrices({});
                setLocalPrices([]);
              }}
            >
              <option value="">-- Choose a category --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select product</label>
              <select 
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none"
                value={selectedProduct?.id || ""}
                onChange={handleProductChange}
              >
                <option value="">-- Choose a product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selectedProduct && (
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Online Prices Box */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 w-full max-w-md">
              <h2 className="text-lg font-semibold text-slate-800 mb-6 border-b pb-4">Online Prices (INR)</h2>
              
              {loadingPrices ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                  <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
                  <p className="text-sm">Scraping prices using Bright Data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {platforms.map((platform) => {
                    const url = selectedProduct.urls[platform];
                    if (!url) return null; // Skip if this product isn't available on this platform

                    const data = prices[platform];
                    return (
                      <div key={platform} className="flex justify-between items-center py-2">
                        <span className="capitalize font-medium text-slate-700">{platform} price</span>
                        {data ? (
                          <span className="font-bold text-slate-900">
                            {data.price ? `₹${data.price}` : <span className="text-red-500 text-sm">{data.status}</span>}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">Not checked</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Local Stores */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 pt-12 md:pt-0">
              <button 
                onClick={fetchLocalStoresPrice}
                disabled={loadingLocal}
                className="rounded-2xl border-2 border-indigo-600 bg-indigo-50 px-8 py-4 text-indigo-700 font-semibold shadow-sm hover:bg-indigo-100 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loadingLocal ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
                check local stores price
              </button>

              {localPrices.length > 0 && (
                <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mt-4">
                  <h3 className="font-semibold text-slate-800 mb-4">Nearby Availability</h3>
                  <div className="space-y-4">
                    {localPrices.map((lp) => (
                      <div key={lp.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div>
                          <p className="font-medium text-slate-800">{lp.attributes?.storeName || "Local Store"}</p>
                          <p className="text-xs text-slate-500">{lp.attributes?.storeAddress || "Generic Local Link"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">₹{lp.latest?.price || lp.desiredPrice || "N/A"}</p>
                          <span className="text-xs text-emerald-600 font-medium">In Stock</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!loadingLocal && localPrices.length === 0 && selectedProduct && (
                <p className="text-sm text-slate-400 italic">No local prices found for this product yet.</p>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
