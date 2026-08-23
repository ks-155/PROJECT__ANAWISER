import Link from "next/link";

const MAKERS = [
  { name: "Krish Patel", role: "Product and engineering" },
  { name: "Dhrupad Patel", role: "Product and engineering" },
];

const TOOLS = [
  { name: "Bright Data", detail: "Live Indian store prices." },
  { name: "Cursor", detail: "Design and build." },
  { name: "Antigravity", detail: "Built alongside Cursor." },
];

export default function AboutPage() {
  return (
    <main className="px-6 py-16 md:px-12 md:py-24">
      <div className="grid items-start gap-12 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-semibold md:text-6xl">Meet the makers</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80 md:text-xl">
            Krish Patel and Dhrupad Patel are the founders of Anawiser; after taking a careful look
            at the prices available to the public, you can then decide whether to buy online or
            visit the store next door with confidence.
          </p>
          <Link href="/compare" className="btn-accent mt-8">
            Try a comparison
          </Link>

          <div className="mt-10 max-w-md rounded-[1.75rem] border border-[#ffb070]/25 bg-[#3b0f0f]/70 p-7 md:p-8">
            <p className="text-sm uppercase tracking-[0.22em] text-white/55">The idea</p>
            <p className="mt-4 text-xl font-semibold leading-snug text-white">
              One look. Online and the shop next door.
            </p>
            <ol className="mt-6 space-y-4 text-base leading-relaxed text-white/80">
              <li>
                <span className="font-medium text-[var(--accent)]">1.</span> Pick a product you already want.
              </li>
              <li>
                <span className="font-medium text-[var(--accent)]">2.</span> See Amazon, Flipkart, and nearby shops together.
              </li>
              <li>
                <span className="font-medium text-[var(--accent)]">3.</span> Buy where it actually costs less.
              </li>
            </ol>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-[#ff8a3d]/30 bg-[#5a1c12]/70 p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.22em] text-white/55">Makers</p>
            <ul className="mt-6 space-y-5">
              {MAKERS.map((person) => (
                <li key={person.name}>
                  <p className="text-2xl font-semibold text-white">{person.name}</p>
                  <p className="mt-1 text-base text-white/70">{person.role}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.75rem] border border-[#fb7185]/25 bg-[#3b0f0f]/75 p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.22em] text-white/55">Built with</p>
            <ul className="mt-6 space-y-4">
              {TOOLS.map((tool) => (
                <li key={tool.name} className="flex items-baseline justify-between gap-4">
                  <p className="text-lg font-medium text-white">{tool.name}</p>
                  <p className="text-base text-white/65">{tool.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section className="mt-20 grid items-start gap-10 border-t border-white/10 pt-16 md:grid-cols-2">
        <h2 className="text-4xl font-semibold md:text-5xl">Contact us</h2>
        <div className="space-y-5 text-lg text-white/80">
          <p>
            Email{" "}
            <a href="mailto:hello@anawiser.app" className="text-[var(--accent)] underline-offset-4 hover:underline">
              hello@anawiser.app
            </a>
          </p>
          <Link href="/contact" className="btn-ghost">
            Contact page
          </Link>
        </div>
      </section>
    </main>
  );
}
