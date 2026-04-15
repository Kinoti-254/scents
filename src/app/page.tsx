import Link from "next/link";
import EnvNotice from "@/components/EnvNotice";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import { getSiteContent } from "@/lib/siteContent";

export default async function HomePage() {
  const site = await getSiteContent();
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <EnvNotice />;
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow-soft"
            style={{ background: "var(--brand-primary-soft)", color: "var(--brand-primary-strong)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-primary)" }} />
            {site.hero_badge}
          </div>
          <h1 className="font-display text-4xl leading-tight tracking-tight md:text-5xl">
            {site.hero_title}
          </h1>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">
            {site.hero_subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary px-6 py-2.5">
              {site.cta_primary}
            </Link>
            <Link href="/contact" className="btn-outline px-6 py-2.5">
              {site.cta_secondary}
            </Link>
          </div>
        </div>
        <div className="card" style={{ background: "var(--brand-primary-soft)", border: "none" }}>
          <h2 className="font-display text-xl">{site.why_title}</h2>
          <ul className="mt-4 space-y-3">
            {site.why_bullets.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-white"
                  style={{ background: "var(--brand-primary)" }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured picks */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl">Featured picks</h2>
            <p className="text-sm text-slate-500">Fresh arrivals and customer favorites</p>
          </div>
          <Link href="/shop" className="btn-ghost text-sm">
            View all →
          </Link>
        </div>
        {products && products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="card text-sm text-slate-600">
            No products yet. Add some from the admin dashboard.
          </div>
        )}
        <div className="flex justify-center pt-2">
          <Link href="/shop" className="btn-outline px-8 py-2.5">
            See all scents
          </Link>
        </div>
      </section>
    </div>
  );
}

