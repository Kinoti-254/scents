"use client";

import { CartItem } from "@/lib/types";
import { formatKes } from "@/lib/format";

export default function OrderSummary({
  items,
  subtotal
}: {
  items: CartItem[];
  subtotal: number;
}) {
  return (
    <div className="card space-y-4">
      <h2 className="font-medium">Order summary</h2>
      <div className="space-y-2 text-sm text-slate-600">
        {items.map((item) => (
          <div key={item.key} className="flex justify-between">
            <span>
              {item.name}
              {item.variant ? ` (${item.variant})` : ""} x{item.quantity}
            </span>
            <span>{formatKes(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-semibold">
        <span>Total</span>
        <span>{formatKes(subtotal)}</span>
      </div>
    </div>
  );
}
