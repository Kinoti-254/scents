"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith("/admin/login")) {
    return null;
  }

  const handleSignOut = async () => {
    const supabase = supabaseBrowser();
    if (!supabase) {
      router.replace("/admin/login");
      return;
    }
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/admin" className="font-display text-lg">
          Admin
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm sm:justify-end">
          <Link href="/admin/products" className="btn-ghost">
            Products
          </Link>
          <Link href="/admin/categories" className="btn-ghost">
            Categories
          </Link>
          <Link href="/admin/content" className="btn-ghost">
            Content
          </Link>
          <Link href="/admin/guide" className="btn-ghost">
            Guide
          </Link>
          <button className="btn-outline" onClick={handleSignOut}>
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
