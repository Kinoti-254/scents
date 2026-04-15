import { notFound } from "next/navigation";
import EnvNotice from "@/components/EnvNotice";
import ProductDetailClient from "@/components/ProductDetailClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <EnvNotice />;
  }

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
