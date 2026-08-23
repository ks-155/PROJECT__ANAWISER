"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/compare", label: "Compare" },
  { href: "/about", label: "About Us" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="relative z-20 flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-12 md:py-6">
      <Link href="/" className="group min-w-0">
        <span className="logo-mark block text-[1.65rem] leading-none text-[#d4d4d8] md:text-[2rem]">ANAWISER</span>
        <span className="tagline-display mt-2 block max-w-[16rem] text-[0.95rem] text-white/75 md:max-w-none md:text-[1.05rem]">
          Find Best Prices across all major E-Commerce
        </span>
      </Link>
      <nav className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[1.35rem] font-semibold text-white md:gap-x-12 md:text-[1.6rem]">
        {LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={active ? "text-white underline decoration-[var(--accent)] underline-offset-8" : "hover:text-white"}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
