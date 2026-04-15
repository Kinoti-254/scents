"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Category } from "@/lib/types";

export default function AdminCategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("Supabase env vars are missing. Check .env.local.");
      return;
    }
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    setCategories(data ?? []);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async () => {
    setError(null);
    if (!newName.trim()) return;
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("Supabase env vars are missing. Check .env.local.");
      return;
    }
    const { error: insertError } = await supabase
      .from("categories")
      .insert({ name: newName.trim() });
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setNewName("");
    loadCategories();
  };

  const handleUpdate = async (id: string) => {
    setError(null);
    if (!editingName.trim()) return;
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("Supabase env vars are missing. Check .env.local.");
      return;
    }
    const { error: updateError } = await supabase
      .from("categories")
      .update({ name: editingName.trim() })
      .eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setEditingId(null);
    setEditingName("");
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this category?");
    if (!ok) return;
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("Supabase env vars are missing. Check .env.local.");
      return;
    }
    await supabase.from("categories").delete().eq("id", id);
    loadCategories();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Categories</h1>
        <p className="text-sm text-slate-600">
          Manage product categories shown in the shop filter.
        </p>
      </div>

      <div className="card space-y-4">
        <div className="space-y-2">
          <label className="label">New category</label>
          <div className="flex flex-wrap gap-2">
            <input
              className="input max-w-xs"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button className="btn-primary" type="button" onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="card space-y-4">
        <h2 className="font-medium">Existing categories</h2>
        <div className="divide-y">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              {editingId === category.id ? (
                <div className="flex flex-wrap gap-2">
                  <input
                    className="input max-w-xs"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => handleUpdate(category.id)}
                  >
                    Save
                  </button>
                  <button
                    className="btn-outline"
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditingName("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <button
                      className="btn-outline"
                      type="button"
                      onClick={() => {
                        setEditingId(category.id);
                        setEditingName(category.name);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      className="btn-danger"
                      type="button"
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
