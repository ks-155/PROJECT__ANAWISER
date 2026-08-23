import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sans = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anawiser",
  description: "Compare live Indian e-commerce prices with Bright Data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.className} min-h-full antialiased`}>{children}</body>
    </html>
  );
}
