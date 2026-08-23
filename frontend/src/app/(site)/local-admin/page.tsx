"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, CheckCircle, LoaderCircle, MapPin, FileText } from "lucide-react";

const labelClass = "mb-2 block text-sm font-medium text-[var(--text-muted)]";

export default function LocalAdminPage() {
  const [storeName, setStoreName] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [festivalNote, setFestivalNote] = useState("");
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
        body: JSON.stringify({ storeName, productName, price, url, couponCode, festivalNote }),
      });

      if (!res.ok) {
        throw new Error("Failed to add product");
      }

      setSuccess(true);
      setProductName("");
      setPrice("");
      setUrl("");
      setCouponCode("");
      setFestivalNote("");
    } catch (err) {
      console.error(err);
      alert("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12 pb-36 md:px-12">
      <header className="mb-10">
        <p className="text-sm text-white/70">Local shops</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-5xl">Add a local price</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
          Neighbourhood shops belong here too. Publish a price — and during Flipkart Big Billion
          Days or Amazon Great Indian Festival, add your discount code so shoppers can pick the
          counter over the app.
        </p>
        <Link
          href="/docs"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
        >
          <FileText className="h-4 w-4" />
          Docs — how to use this form
        </Link>
      </header>

      {success && (
        <div className="mb-8 flex items-start gap-3 text-[var(--text)]">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
          <div>
            <h3 className="font-medium">Product published</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">It is now live on the Compare page.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass space-y-6 p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-[var(--text-muted)]">Store name</label>
              <Link href="/docs" className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline">
                <FileText className="h-3.5 w-3.5" />
                Docs
              </Link>
            </div>
            <div className="relative">
              <Store className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Rahul Electronics"
                className="field-ghost field-icon"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Product name</label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5"
              className="field-ghost"
            />
          </div>

          <div>
            <label className={labelClass}>Current selling price (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="29990"
              className="field-ghost"
            />
          </div>

          <div>
            <label className={labelClass}>Festival / shop coupon (optional)</label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="e.g. STORE15"
              className="field-ghost"
            />
          </div>
          <div>
            <label className={labelClass}>Offer note (optional)</label>
            <input
              type="text"
              value={festivalNote}
              onChange={(e) => setFestivalNote(e.target.value)}
              placeholder="e.g. Matches Flipkart Big Billion Days"
              className="field-ghost"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Store address or location link (optional)</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. https://maps.app.goo.gl/... or Shop No. 5, MG Road"
                className="field-ghost field-icon"
              />
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              If left blank, a generic local link will be generated.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-accent disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Publishing…
            </span>
          ) : (
            "Publish product"
          )}
        </button>
      </form>
    </main>
  );
}
