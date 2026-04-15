"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteContent } from "@/lib/siteContentShared";

const STORAGE_KEY = "sfc-panel-dismissed";

const FEATURED_PRODUCTS = [
  {
    name: "Sauvage EDP",
    note: "Fresh & Spicy",
    img: "https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dw24a244fd/Y0785220/Y0785220_F078524009_E01_RHC.jpg?sw=800"
  },
  {
    name: "Acqua Di Gio",
    note: "Aquatic & Citrus",
    img: "https://www.giorgioarmanibeauty-usa.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-gab-master-catalog/default/dw04d58b00/products/2025/A005%20RESTAGE/3614273955546_01.jpg?q=85&sfrm=jpg&sh=430&sm=cut&sw=430"
  },
  {
    name: "Libre EDP",
    note: "Bold Floral",
    img: "https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-master-catalog/default/dw3cedbd53/Images2019/Libre%20Eau%20De%20Parfum/90mL/3614272648425.jpg?q=85&sfrm=jpg&sh=320&sm=cut&sw=320"
  },
  {
    name: "Daisy EDT",
    note: "Soft & Sweet",
    img: "https://cdn.media.amplience.net/i/Marc_Jacobs/MJI_31655513034_000_F8F8F8_4-5_MAIN"
  },
  {
    name: "Miss Dior EDP",
    note: "Velvety Rose",
    img: "https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dw8822db34/Y0996347/Y0996347_C099600764_E01_RHC.jpg?sw=800"
  },
  {
    name: "Oud Wood",
    note: "Rich & Smoky",
    img: "https://sdcdn.io/tf/tf_sku_TAJK01_2000x2000_0.png?height=700px&width=700px"
  }
];

export default function SidePanel({ site }: { site: SiteContent }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const panelImages = useMemo(
    () => site.panel_images.slice(0, 6),
    [site.panel_images]
  );

  // Use admin panel_images if set, otherwise fall back to featured products
  const featuredItems = useMemo(() => {
    return FEATURED_PRODUCTS.map((fp, i) => ({
      name: fp.name,
      note: fp.note,
      img: panelImages[i] || fp.img
    }));
  }, [panelImages]);

  useEffect(() => {
    setHasMounted(true);
    if (pathname.startsWith("/admin")) return;
    const dismissed = window.sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timeout = window.setTimeout(() => setOpen(true), 200);
      return () => window.clearTimeout(timeout);
    }
  }, [pathname]);

  const handleClose = () => {
    setOpen(false);
    window.sessionStorage.setItem(STORAGE_KEY, "true");
  };

  if (!hasMounted || pathname.startsWith("/admin")) return null;

  return (
    <div
      className={`fixed inset-0 z-40 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Panel */}
      <aside
        className="panel-curtain absolute left-0 top-0 flex h-full w-[min(94vw,400px)] flex-col overflow-y-auto bg-white shadow-[4px_0_32px_rgba(0,0,0,0.15)]"
        data-open={open}
        role="dialog"
        aria-label="Welcome panel"
      >
        {/* Header strip */}
        <div
          className="relative flex items-center justify-between px-5 py-4"
          style={{ background: "var(--brand-primary)" }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-2 ring-white/40">
              <Image
                src={site.logo_url || "/logo.svg"}
                alt={`${site.store_name} logo`}
                width={40}
                height={40}
                className="h-9 w-9 rounded-full object-cover"
                priority
              />
            </span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
                Welcome to
              </p>
              <h2 className="font-display text-base font-semibold text-white">
                {site.store_name}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
            aria-label="Close panel"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Tagline */}
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-sm leading-relaxed text-slate-600">
            ✨ Fresh arrivals, authentic decants &amp; everyday favorites.
            <br />
            <span className="font-medium text-slate-800">Order instantly via WhatsApp.</span>
          </p>
        </div>

        {/* Featured scents grid */}
        <div className="flex-1 px-5 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Featured Scents
          </p>
          <div className="grid grid-cols-2 gap-3">
            {featuredItems.map((item, index) => (
              <Link
                key={index}
                href="/shop"
                onClick={handleClose}
                className="group relative overflow-hidden rounded-2xl bg-sand transition hover:shadow-soft"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="(max-width: 400px) 44vw, 176px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Text on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-xs font-semibold leading-tight text-white">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-white/75">{item.note}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="border-t border-slate-100 px-5 pb-6 pt-4 space-y-2">
          <Link
            href="/shop"
            onClick={handleClose}
            className="btn-primary flex w-full items-center justify-center gap-2 py-3 text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Browse All Scents
          </Link>
          <Link
            href="/contact"
            onClick={handleClose}
            className="btn-outline flex w-full items-center justify-center gap-2 py-3 text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.563 4.14 1.545 5.873L0 24l6.286-1.545A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.925 0-3.724-.512-5.272-1.406l-.378-.224-3.932.967.984-3.814-.248-.393A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp Us
          </Link>
        </div>
      </aside>
    </div>
  );
}
