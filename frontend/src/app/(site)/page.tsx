import Image from "next/image";
import Link from "next/link";
import { Shield, SlidersHorizontal, Star, UserRound } from "lucide-react";
import { SplineHero } from "@/components/spline-hero";
import { sampleDatasetPhotos } from "@/lib/product-images";

const FEATURES = [
  {
    icon: UserRound,
    title: "Easy to scan",
    body: "Select a category and a product; Anawiser then gets the listings from Amazon, Flipkart, and the surrounding shops without using a spreadsheet.",
  },
  {
    icon: SlidersHorizontal,
    title: "Online plus Local Pricings",
    body: "Next to the neighbourhood price figures are the prices displayed in the public storefronts, which means a shop a little way down the road can outdo the big one.",
  },
  {
    icon: Shield,
    title: "Always checking",
    body: "The prices are updated when the storefront information changes, which means the comparison remains useful if you come again.",
  },
];

const REVIEWS = [
  {
    name: "Kirthi",
    photo: "/reviews/kirthi.jpg",
    quote: "Five shopping tabs used to be my routine. Now I open Anawiser once.",
  },
  {
    name: "Suman",
    photo: "/reviews/suman.jpg",
    quote: "Seeing a local shop next to Amazon sold me. Online is not always cheaper.",
  },
  {
    name: "Megh",
    photo: "/reviews/megh.jpg",
    quote: "Festival prices and a nearby quote, side by side. Felt like a real product.",
  },
];

export default function HomePage() {
  const samples = sampleDatasetPhotos(8);

  return (
    <main className="px-6 pb-24 md:px-12">
      <section className="relative grid grid-cols-1 items-center gap-8 py-8 sm:grid-cols-2 sm:gap-10 md:py-14">
        <div className="relative z-10">
          <p className="text-sm tracking-wide text-white/70">Analyser + Wiser</p>
          <p className="logo-mark mt-3 text-3xl text-[#d4d4d8] md:text-5xl">ANAWISER</p>
          <p className="tagline-display mt-4 max-w-lg text-2xl text-white/90 md:text-4xl">
            Find Best Prices across all major E-Commerce
          </p>
          <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight md:text-6xl">
            Track prices.
            <br />
            Save budget.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-snug text-white/80">
            Compare Amazon, Flipkart, and nearby shops in one look — then buy where it actually
            costs less.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/compare" className="btn-accent">
              Compare prices
            </Link>
            <Link href="#what" className="btn-ghost">
              What is Anawiser?
            </Link>
          </div>
        </div>
        <div className="relative min-h-[420px] w-full md:min-h-[560px]">
          <SplineHero />
        </div>
      </section>

      <section id="what" className="grid items-stretch gap-8 py-16 md:grid-cols-2">
        <div className="glass flex flex-col justify-center p-8 md:p-10">
          <h2 className="text-3xl font-semibold md:text-5xl">What is Anawiser?</h2>
          <p className="mt-6 text-xl leading-relaxed text-white/85 md:text-2xl">
            Analyser + Wiser. Live prices from big stores and nearby shops, so you pick the wiser buy.
          </p>
        </div>
        <div className="glass flex flex-col justify-center p-8 md:p-10">
          <p className="text-lg font-medium uppercase tracking-[0.18em] text-white/75">Why it exists</p>
          <ul className="mt-6 space-y-4 text-xl leading-relaxed text-white/85 md:text-2xl">
            <li>Amazon, Flipkart, and nearby shops in one pass.</li>
            <li>Spot when a local counter beats a website.</li>
            <li>Keep the extra rupees instead of hunting them.</li>
          </ul>
        </div>
      </section>

      {samples.length > 0 ? (
        <section className="py-16">
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
            Looking for best prices for electronics
            <span className="mt-2 block text-[var(--accent)]">We got it!</span>
          </h2>
          <p className="mt-3 max-w-md text-lg text-white/75">Phones and laptops, matched to the product you pick.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {samples.map((photo) => (
              <div key={photo.id} className="glass overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.labels.join(", ") || "electronics photo"} className="h-52 w-full object-cover md:h-64" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="py-16">
        <h2 className="text-4xl font-semibold md:text-5xl">Features</h2>
        <div className="mt-8 grid items-stretch gap-8 md:grid-cols-2">
          <div className="relative min-h-[320px] h-full overflow-hidden rounded-[1.75rem] md:min-h-[28rem]">
            <Image
              src="/hero.jpg"
              alt="Abstract blue curves"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="glass flex flex-col justify-center space-y-8 p-8 md:p-10">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4">
                <Icon className="mt-0.5 h-9 w-9 shrink-0 text-white" strokeWidth={1.4} />
                <div>
                  <h3 className="text-xl font-medium md:text-2xl">{title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-white/80 md:text-lg">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-4xl font-semibold md:text-5xl">Reviews</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <article
              key={review.name}
              className={`relative overflow-hidden rounded-[1.75rem] border p-8 ${
                i === 0
                  ? "border-[#ff8a3d]/40 bg-gradient-to-br from-[#7a2412]/90 to-[#3b0f0f]/90"
                  : i === 1
                    ? "border-[#fb7185]/35 bg-gradient-to-br from-[#5a1530]/90 to-[#2a0c14]/90"
                    : "border-[#ffc078]/35 bg-gradient-to-br from-[#5a2a12]/90 to-[#2a1008]/90"
              }`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-1.5 ${
                  i === 0 ? "bg-[#ff8a3d]" : i === 1 ? "bg-[#fb7185]" : "bg-[#ffc078]"
                }`}
              />
              <p className="pointer-events-none absolute right-5 top-6 select-none text-7xl font-serif leading-none text-white/10">
                ”
              </p>
              <div className="relative flex items-center gap-4">
                <Image
                  src={review.photo}
                  alt={review.name}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-full object-cover ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[#1a0b00]"
                />
                <div>
                  <h3 className="text-2xl font-semibold">{review.name}</h3>
                  <p className="mt-0.5 text-sm text-white/55">Verified shopper</p>
                  <div className="mt-1 flex gap-0.5 text-[var(--accent)]">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star key={star} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="relative mt-6 text-lg leading-relaxed text-white/90">{review.quote}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid items-center gap-10 py-16 md:grid-cols-2">
        <div>
          <h2 className="text-4xl font-semibold md:text-5xl">Meet the makers</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80">
            Krish Patel and Dhrupad Patel are the founders of Anawiser; after taking a careful look
            at the prices available to the public, you can then decide whether to buy online or
            visit the store next door with confidence.
          </p>
          <Link href="/about" className="btn-ghost mt-6">
            More about the team
          </Link>
        </div>
        <div className="glass min-h-[240px] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-white/50">Analyser + Wiser</p>
          <p className="mt-6 text-2xl font-semibold leading-snug">
            Look once. Pay less. Walk away wiser.
          </p>
          <p className="mt-4 text-sm text-white/60">Krish Patel · Dhrupad Patel</p>
        </div>
      </section>

      <section className="grid items-start gap-10 border-t border-white/10 py-16 md:grid-cols-2">
        <h2 className="text-4xl font-semibold md:text-5xl">Contact</h2>
        <div className="space-y-6 text-white/80">
          <div>
            <p className="text-sm text-white/50">Email</p>
            <p className="mt-1">hello@anawiser.app</p>
          </div>
          <Link href="/contact" className="btn-ghost">
            Contact page
          </Link>
        </div>
      </section>
    </main>
  );
}
