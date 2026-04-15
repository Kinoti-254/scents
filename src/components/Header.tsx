import Link from "next/link";
import Image from "next/image";
import CartCount from "@/components/CartCount";
import { SiteContent } from "@/lib/siteContentShared";

export default function Header({ site }: { site: SiteContent }) {
  const logoUrl = site.logo_url || "/logo.svg";
  const waNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${site.store_name}, I'd like to place an order.`)}`
    : "/contact";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:py-3">
        {/* Logo + name */}
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-soft">
            <Image
              src={logoUrl}
              alt={`${site.store_name} logo`}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
              priority
            />
          </span>
          <span className="max-w-[40vw] truncate font-display text-base font-semibold tracking-wide text-slate-900 sm:max-w-none sm:text-lg">
            {site.store_name}
          </span>
        </Link>

        {/* Nav */}
        <nav className="ml-auto flex flex-wrap items-center justify-end gap-1 text-sm font-medium sm:gap-2">
          <Link href="/shop" className="nav-link rounded-full px-3 py-1.5 text-slate-700 hover:bg-slate-100">
            Shop
          </Link>
          <Link href="/contact" className="nav-link rounded-full px-3 py-1.5 text-slate-700 hover:bg-slate-100">
            Contact
          </Link>

          {/* WhatsApp quick link */}
          <Link
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition sm:flex"
            style={{ background: "#25D366", color: "white" }}
            aria-label="Chat on WhatsApp"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.563 4.14 1.545 5.873L0 24l6.286-1.545A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.925 0-3.724-.512-5.272-1.406l-.378-.224-3.932.967.984-3.814-.248-.393A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Order
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium transition hover:border-slate-300 hover:bg-slate-50"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span
              className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-bold text-white"
              style={{ background: "var(--brand-primary)" }}
            >
              <CartCount />
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
