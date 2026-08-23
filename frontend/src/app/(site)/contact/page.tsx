export default function ContactPage() {
  return (
    <main className="grid gap-16 px-6 py-16 md:grid-cols-[1fr_1fr] md:px-12 md:py-24">
      <h1 className="text-5xl font-semibold md:text-7xl">Contact</h1>
      <div className="space-y-10 text-white/85">
        <div>
          <h2 className="text-xl font-medium">Email</h2>
          <p className="mt-2 text-white/70">hello@anawiser.app</p>
        </div>
        <div>
          <h2 className="text-xl font-medium">Product</h2>
          <p className="mt-2 max-w-sm text-white/70">
            Questions about Compare or local shop prices — write to the address above.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-medium">Social</h2>
          <p className="mt-2 text-white/70">Coming soon</p>
        </div>
      </div>
    </main>
  );
}
