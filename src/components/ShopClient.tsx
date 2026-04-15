"use client";

import { useMemo, useState } from "react";
import { Category, Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function ShopClient({
  categories,
  products
}: {
  categories: Category[];
  products: Product[];
}) {
  const [selected, setSelected] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = selected === "all" ? products : products.filter((p) => p.category_id === selected);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, selected, search]);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="space-y-1">
        <h1 className="font-display text-3xl">Shop</h1>
        <p className="text-sm text-slate-500">
          {products.length} scent{products.length !== 1 ? "s" : ""} available right now
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          className="input pl-9 pr-4"
          placeholder="Search by name or scent notes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`pill transition ${selected === "all" ? "border-transparent text-white" : "hover:border-slate-300"}`}
          style={selected === "all" ? { background: "var(--brand-primary)", borderColor: "var(--brand-primary)" } : {}}
          onClick={() => setSelected("all")}
        >
          All ({products.length})
        </button>
        {categories.map((category) => {
          const count = products.filter((p) => p.category_id === category.id).length;
          return (
            <button
              key={category.id}
              className={`pill transition ${selected === category.id ? "border-transparent text-white" : "hover:border-slate-300"}`}
              style={selected === category.id ? { background: "var(--brand-primary)", borderColor: "var(--brand-primary)" } : {}}
              onClick={() => setSelected(category.id)}
            >
              {category.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card space-y-2 text-center">
          <p className="text-slate-600">No scents found{search ? ` for "${search}"` : " in this category"}.</p>
          {search && (
            <button className="btn-ghost text-sm" onClick={() => setSearch("")}>Clear search</button>
          )}
        </div>
      ) : (
        <>
          {search && (
            <p className="text-sm text-slate-500">{filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{search}&quot;</p>
          )}
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
