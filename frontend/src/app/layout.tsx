import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const parentFont = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anawiser — analyser + wiser",
  description:
    "Compare live Indian store prices in one place. Anawiser is Analyser + Wiser: track prices, save your budget.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${parentFont.variable} ${displayFont.variable} ${parentFont.className} min-h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
