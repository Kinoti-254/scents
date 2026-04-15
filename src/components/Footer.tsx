import Link from "next/link";
import { SiteContent } from "@/lib/siteContentShared";

export default function Footer({ site }: { site: SiteContent }) {
  const waNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${site.store_name}, I'd like to place an order.`)}`
    : "/contact";

  return (
    <footer className="border-t border-slate-200/60 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-base font-semibold text-slate-900">{site.store_name}</p>
            <p className="mt-1 text-sm text-slate-500">Authentic scents. Order fast via WhatsApp.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <Link href="/shop" className="hover:text-slate-900 transition">Shop</Link>
            <Link href="/cart" className="hover:text-slate-900 transition">Cart</Link>
            <Link href="/contact" className="hover:text-slate-900 transition">Contact</Link>
            <Link
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition"
              style={{ color: "#25D366" }}
            >
              WhatsApp Order
            </Link>
          </div>
        </div>
        <p className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} {site.store_name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
