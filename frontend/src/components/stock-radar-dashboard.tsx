"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Plus, Activity, Bell, PackageOpen, Tag, RefreshCw, Store } from "lucide-react";
import Link from "next/link";

export function AnawiserDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [desiredPrice, setDesiredPrice] = useState("");
  const [alerts, setAlerts] = useState<string[]>([]);
  const [busyProductId, setBusyProductId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/anawiser/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      setLoading(true);
      await fetch("/api/anawiser/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, desiredPrice: desiredPrice || null }),
      });
      setUrl("");
      setDesiredPrice("");
      await fetchProducts();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleRunCheck = async (productId: string) => {
    try {
      setBusyProductId(productId);
      const res = await fetch("/api/anawiser/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      
      if (data.alert) {
        setAlerts((prev) => [data.alert, ...prev].slice(0, 5)); // keep last 5 alerts
      }
      
      await fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setBusyProductId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8 md:px-8 font-sans bg-slate-50 min-h-screen">
      <header className="mb-10 relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 md:px-12 text-white shadow-2xl border border-slate-800">
        
        {/* SPLINE 3D PLACEHOLDER
            When you're ready to add your Spline design, install @splinetool/react-spline 
            and replace this background div with your Spline component:
            <div className="absolute inset-0 z-0 opacity-60">
              <Spline scene="https://prod.spline.design/YOUR-SCENE-URL/scene.splinecode" />
            </div>
        */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl mix-blend-screen z-0" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl mix-blend-screen z-0" />

        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-teal-400 mb-6 bg-teal-950/50 w-fit px-3 py-1.5 rounded-full border border-teal-800/50 backdrop-blur-sm">
              <Activity className="h-4 w-4" />
              <span>Anawiser MVP</span>
            </div>
            <h1 className="max-w-2xl font-display text-4xl leading-[1.1] tracking-tight md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Real-Time Stock Availability & Price Drop Alerts
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300 font-light">
              Monitor high-demand products across local shops and retailers. Get instant alerts when items restock or drop below your desired price.
            </p>
          </div>
          <Link href="/local-admin" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-6 py-3 text-sm font-medium transition-all duration-300 border border-white/10 w-fit backdrop-blur-md shadow-lg hover:shadow-white/5 hover:-translate-y-0.5">
            <Store className="h-4 w-4" />
            Local Store Admin
          </Link>
        </div>
      </header>

      <div className="grid md:grid-cols-[1fr_350px] gap-8">
        
        {/* Main Content */}
        <div className="space-y-8">
          {/* Add Product Form */}
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8 transition-all hover:shadow-md">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-slate-400" />
              Add Product to Monitor
            </h2>
            <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Product URL</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/product/123"
                  className="w-full rounded-lg border-slate-300 border px-4 py-2 text-sm focus:border-teal-500 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Desired Price (Optional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={desiredPrice}
                    onChange={(e) => setDesiredPrice(e.target.value)}
                    placeholder="199.99"
                    className="w-full rounded-lg border-slate-300 border pl-8 pr-4 py-2 text-sm focus:border-teal-500 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full sm:w-auto self-start rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50 transition-colors"
              >
                Start Monitoring
              </button>
            </form>
          </section>

          {/* Monitored Products List */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Monitored Products</h2>
              <button onClick={fetchProducts} className="text-slate-400 hover:text-teal-600 transition-colors">
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-10"><LoaderCircle className="h-6 w-6 animate-spin text-teal-600" /></div>
            ) : products.length === 0 ? (
              <div className="text-center p-10 border border-dashed border-slate-300 rounded-xl text-slate-500">
                No products being monitored yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => {
                  const isLocal = product.attributes?.isLocal === "true";
                  const storeName = isLocal 
                    ? product.attributes?.storeName 
                    : (product.url.includes("amazon") ? "Amazon" : "Online Retailer");
                    
                  return (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${isLocal ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                           {isLocal ? <Store className="h-3 w-3"/> : null}
                           {storeName}
                        </span>
                      </div>
                      <a href={product.url.startsWith("local://") ? "#" : product.url} target={product.url.startsWith("local://") ? undefined : "_blank"} rel="noreferrer" className="text-sm font-medium text-teal-600 hover:underline truncate block">
                        {product.name || product.url}
                      </a>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                        {product.desiredPrice && (
                          <span className="flex items-center gap-1">
                            <Tag className="h-3.5 w-3.5" />
                            Target: ₹{product.desiredPrice}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <PackageOpen className="h-3.5 w-3.5" />
                          Status: 
                          <span className={product.latest?.inStock ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"}>
                            {product.latest ? (product.latest.inStock ? " In Stock" : " Out of Stock") : " Unknown"}
                          </span>
                        </span>
                        {product.latest?.price && (
                          <span className="font-semibold text-slate-700">
                            Current: ₹{product.latest.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {!isLocal && (
                      <button
                        onClick={() => handleRunCheck(product.id)}
                        disabled={busyProductId === product.id}
                        className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {busyProductId === product.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                        Check Now
                      </button>
                    )}
                  </div>
                )})}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Alerts */}
        <aside>
          <div className="sticky top-8 bg-slate-50 rounded-xl border border-slate-200 p-5 min-h-[400px]">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              Alerts
            </h3>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No alerts triggered yet. Click "Check Now" on a product to run a price check.</p>
              ) : (
                alerts.map((alert, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm text-sm text-slate-700 whitespace-pre-wrap">
                    {alert}
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
