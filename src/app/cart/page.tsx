"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import CartItemRow from "@/components/CartItemRow";
import OrderSummary from "@/components/OrderSummary";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const clear = useCartStore((state) => state.clear);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md">
        <div className="card space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl">Your cart is empty</h1>
            <p className="mt-2 text-sm text-slate-500">Browse the shop and add your favorite scents.</p>
          </div>
          <Link href="/shop" className="btn-primary inline-flex">Browse shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl">Your cart</h1>
          <button
            className="btn-ghost text-xs text-slate-500"
            onClick={() => { if (confirm("Clear all items from cart?")) clear(); }}
          >
            Clear all
          </button>
        </div>
        <div className="card divide-y divide-slate-100 p-0">
          {items.map((item) => (
            <div key={item.key} className="px-4 py-4 first:pt-4 last:pb-4">
              <CartItemRow item={item} />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <OrderSummary items={items} subtotal={subtotal} />
        <Link href="/order" className="btn-primary flex w-full items-center justify-center gap-2 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.138.563 4.14 1.545 5.873L0 24l6.286-1.545A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.925 0-3.724-.512-5.272-1.406l-.378-.224-3.932.967.984-3.814-.248-.393A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Proceed to order
        </Link>
        <Link href="/shop" className="btn-ghost flex w-full justify-center text-sm">
          ← Continue shopping
        </Link>
      </div>
    </div>
  );
}
