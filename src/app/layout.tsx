import "./globals.css";
import type { CSSProperties } from "react";
import { Manrope, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SidePanel from "@/components/SidePanel";
import { getSiteContent } from "@/lib/siteContent";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

export async function generateMetadata() {
  const site = await getSiteContent();
  const title = site.store_name;
  const description =
    "Browse perfumes and decants, add to cart, and order via WhatsApp.";

  return {
    title,
    description,
    openGraph: {
      title,
      description
    }
  };
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteContent();
  const brandVars = {
    "--brand-primary": site.brand_primary,
    "--brand-primary-strong": site.brand_primary_strong,
    "--brand-primary-soft": site.brand_primary_soft,
    "--brand-accent": site.brand_accent,
    "--brand-accent-soft": site.brand_accent_soft
  } as CSSProperties;

  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-screen" style={brandVars}>
        <SidePanel site={site} />
        <Header site={site} />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
        <Footer site={site} />
      </body>
    </html>
  );
}
