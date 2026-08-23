"use client";

import { useState } from "react";
import { Store, CheckCircle, LoaderCircle, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LocalAdminPage() {
  const [storeName, setStoreName] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/anawiser/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeName, productName, price, url }),
      });

      if (!res.ok) {
        throw new Error("Failed to add product");
      }

      setSuccess(true);
      setProductName("");
      setPrice("");
      setUrl("");
      // keep storeName filled for easy bulk adding
    } catch (err) {
      console.error(err);
      alert("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 font-sans">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <header className="mb-10 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 px-8 py-12 text-white shadow-xl text-center">
        <Store className="h-12 w-12 mx-auto mb-4 text-indigo-400" />
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Local Store Admin Panel
        </h1>
        <p className="mt-4 text-slate-300 max-w-xl mx-auto">
          Add your shop's inventory to the Anawiser network. Local products appear alongside Amazon and Dmart, giving you visibility without ad spend.
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        {success && (
          <div className="mb-8 rounded-lg bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3 text-emerald-800">
            <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Product Published!</h3>
              <p className="text-sm mt-1">Your product is now live on the Anawiser dashboard.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Store Name</label>
              <div className="relative">
                <Store className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Rahul Electronics"
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current Selling Price (₹)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="29990"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Store Address / Location Link (Optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. https://maps.app.goo.gl/... or 'Shop No. 5, MG Road'"
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                If left blank, a generic local link will be generated.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Product to Network"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
