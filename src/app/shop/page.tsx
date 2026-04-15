import EnvNotice from "@/components/EnvNotice";
import ShopClient from "@/components/ShopClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ShopPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <EnvNotice />;
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("created_at", { ascending: false });

  return (
    <ShopClient categories={categories ?? []} products={products ?? []} />
  );
}
