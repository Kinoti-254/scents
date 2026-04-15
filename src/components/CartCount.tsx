"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cartStore";

export default function CartCount() {
  const count = useCartStore((state) => state.totalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return 0;
  return <>{count}</>;
}
