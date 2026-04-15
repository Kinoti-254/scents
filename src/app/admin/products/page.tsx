"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Product, Category } from "@/lib/types";
import { formatKes } from "@/lib/format";
import AdminProductForm from "@/components/admin/AdminProductForm";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("Supabase env vars are missing. Check .env.local.");
      setLoading(false);
      return;
    }
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (categoryError || productError) {
      setError("Failed to load admin data.");
    }

    setCategories(categoryData ?? []);
    setProducts(productData ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this product?");
    if (!ok) return;
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("Supabase env vars are missing. Check .env.local.");
      return;
    }
    await supabase.from("products").delete().eq("id", id);
    loadData();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl">Products</h1>
        <p className="text-sm text-slate-600">
          Add, edit, and manage perfume/decant listings.
        </p>
      </div>

      <AdminProductForm
        categories={categories}
        editingProduct={editingProduct}
        onSaved={() => {
          setEditingProduct(null);
          loadData();
        }}
        onCancelEdit={() => setEditingProduct(null)}
      />

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Existing products</h2>
          {loading && <span className="text-xs text-slate-500">Loading...</span>}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {products.length === 0 && !loading && (
          <p className="text-sm text-slate-600">No products yet.</p>
        )}
        <div className="divide-y">
          {products.map((product) => (
            <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-slate-600">
                  {formatKes(product.price)}
                  {!product.in_stock && " (out of stock)"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-outline"
                  onClick={() => setEditingProduct(product)}
                >
                  Edit
                </button>
                <button className="btn-danger" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
