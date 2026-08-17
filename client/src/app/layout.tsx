import type { Metadata } from "next";
import { Geist_Mono, Manrope, Noto_Serif_Bengali, Dancing_Script, Playfair_Display } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// English body/UI font.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// Bangla body/UI font — Manrope has no Bengali glyphs, so this is the fallback
// the --font-sans stack uses whenever the current locale renders Bangla copy.
const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-noto-serif-bengali",
  weight: "400",
  subsets: ["bengali"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Script accent font — used sparingly for the wordmark flourish in
// BrandStorySection, never for body copy or anything that needs to stay legible.
const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
});

// Serif display font — the hero's "BANGLADESH'S TRUSTED" eyebrow line,
// echoing an engraved/luxury look. Not used for body copy.
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gold BD — Buy & Sell Digital Gold",
  description: "Buy, sell, and hold gold in Bangladesh — backed by a transparent, auditable ledger.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${notoSerifBengali.variable} ${geistMono.variable} ${dancingScript.variable} ${playfairDisplay.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
