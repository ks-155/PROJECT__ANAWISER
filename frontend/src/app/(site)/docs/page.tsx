import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16 pb-32 md:px-12 md:py-24">
      <p className="text-sm text-white/70">Docs</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-6xl">How to use Anawiser</h1>
      <p className="mt-5 text-lg leading-relaxed text-white/80">
        Anawiser puts Amazon, Flipkart, Blinkit, Croma, Reliance, D-Mart, and nearby shops in one
        look — so you buy where it actually costs less.
      </p>

      <section className="mt-12 space-y-8">
        <article className="rounded-[1.5rem] border border-white/10 bg-black/25 p-6 md:p-8">
          <h2 className="text-2xl font-semibold">For shoppers</h2>
          <ol className="mt-5 space-y-4 text-base leading-relaxed text-white/80">
            <li>
              <span className="font-medium text-[var(--accent)]">1.</span> Open Compare.
            </li>
            <li>
              <span className="font-medium text-[var(--accent)]">2.</span> Pick a category, then a product.
            </li>
            <li>
              <span className="font-medium text-[var(--accent)]">3.</span> Read live public prices and any
              nearby shop quote.
            </li>
            <li>
              <span className="font-medium text-[var(--accent)]">4.</span> During festival sales, check the
              discount chips — then buy online or walk to the counter.
            </li>
          </ol>
        </article>

        <article className="rounded-[1.5rem] border border-white/10 bg-black/25 p-6 md:p-8">
          <h2 className="text-2xl font-semibold">For retailers</h2>
          <ol className="mt-5 space-y-4 text-base leading-relaxed text-white/80">
            <li>
              <span className="font-medium text-[var(--accent)]">1.</span> Tap{" "}
              <strong>Are you a retailer? Try this</strong> at the bottom of any page.
            </li>
            <li>
              <span className="font-medium text-[var(--accent)]">2.</span> Enter store name, product, and
              selling price.
            </li>
            <li>
              <span className="font-medium text-[var(--accent)]">3.</span> Optional: add a coupon, an offer
              note, and a Maps link so shoppers can find you.
            </li>
            <li>
              <span className="font-medium text-[var(--accent)]">4.</span> Publish. Your price then appears
              under Nearby shops on Compare.
            </li>
          </ol>
          <Link href="/local-admin" className="btn-accent mt-6">
            Open the local price form
          </Link>
        </article>
      </section>

      <p className="mt-12 text-sm text-white/60">
        Questions? Use <span className="text-white/80">Got any questions?</span> or write to{" "}
        <a href="mailto:hello@anawiser.app" className="text-[var(--accent)] hover:underline">
          hello@anawiser.app
        </a>
        .
      </p>
    </main>
  );
}
