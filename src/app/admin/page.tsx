import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminHomePage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/admin/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Admin Dashboard</h1>
      <p className="text-sm text-slate-600">
        Manage products, categories, and storefront content.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/products" className="btn-primary">
          Manage products
        </Link>
        <Link href="/admin/categories" className="btn-outline">
          Manage categories
        </Link>
        <Link href="/admin/content" className="btn-outline">
          Manage content
        </Link>
        <Link href="/admin/guide" className="btn-ghost">
          Guide
        </Link>
      </div>
      <p className="text-xs text-slate-400">Signed in as {user.email}</p>
    </div>
  );
}