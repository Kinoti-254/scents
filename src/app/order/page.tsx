"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import { supabaseBrowser } from "@/lib/supabase/client";
import OrderSummary from "@/components/OrderSummary";

const PHONE_RE = /^[0-9+\s().-]{7,16}$/;

export default function OrderPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const clear = useCartStore((state) => state.clear);

  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const shouldSave = process.env.NEXT_PUBLIC_SAVE_ORDERS === "true";

  if (items.length === 0 && status !== "sent") {
    return (
      <div className="card mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <h1 className="font-display text-2xl">No items in cart</h1>
        <p className="mt-2 text-sm text-slate-600">Add products before placing an order.</p>
        <Link href="/shop" className="btn-primary mt-4 inline-flex">Browse shop</Link>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="card mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--brand-primary-soft)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--brand-primary)" }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-display text-2xl">Order sent!</h1>
        <p className="mt-2 text-sm text-slate-600">WhatsApp opened in a new tab with your order summary. If it didn&apos;t open, check your popup blocker.</p>
        {saveError && <p className="mt-2 text-xs text-amber-600">{saveError}</p>}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/shop" className="btn-outline">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.phone.trim()) {
      e.phone = "Phone number is required.";
    } else if (!PHONE_RE.test(form.phone.trim())) {
      e.phone = "Enter a valid phone number (e.g. 0712 345678).";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaveError(null);
    if (!validate()) return;
    if (!whatsappNumber) {
      setErrors({ phone: "WhatsApp number is not configured yet." });
      return;
    }

    setStatus("submitting");

    if (shouldSave) {
      const supabase = supabaseBrowser();
      if (!supabase) {
        setSaveError("Supabase env vars missing. Order not saved to database.");
      } else {
        const { error: insertError } = await supabase.from("orders").insert({
          customer_name: form.name.trim(),
          phone: form.phone.trim(),
          location: form.location.trim() || "Not specified",
          cart_items: items,
          total: subtotal
        });
        if (insertError) setSaveError("Order save failed, but WhatsApp will still open.");
      }
    }

    const message = buildWhatsAppMessage({
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      items,
      total: subtotal
    });

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
    clear();
    setStatus("sent");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <h1 className="font-display text-2xl">Order details</h1>
        <form onSubmit={handleSubmit} noValidate className="card space-y-5">
          <div className="space-y-1">
            <label className="label" htmlFor="name">Your name <span className="text-red-500">*</span></label>
            <input
              id="name"
              className={`input ${errors.name ? "border-red-400" : ""}`}
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors((prev) => ({ ...prev, name: undefined })); }}
              placeholder="e.g. Jane Wanjiru"
              autoComplete="name"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="label" htmlFor="phone">Phone number <span className="text-red-500">*</span></label>
            <input
              id="phone"
              className={`input ${errors.phone ? "border-red-400" : ""}`}
              value={form.phone}
              onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors((prev) => ({ ...prev, phone: undefined })); }}
              placeholder="e.g. 0712 345 678"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
            />
            {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
          </div>

          <div className="space-y-1">
            <label className="label" htmlFor="location">Delivery location <span className="text-slate-400 font-normal">(optional)</span></label>
            <input
              id="location"
              className="input"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Westlands, Nairobi"
              autoComplete="address-level2"
            />
            <p className="text-xs text-slate-500">You can also share your live location in the WhatsApp chat.</p>
          </div>

          <button
            type="submit"
            className="btn-primary flex w-full items-center justify-center gap-2 py-3 disabled:opacity-60"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Sending…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.138.563 4.14 1.545 5.873L0 24l6.286-1.545A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.925 0-3.724-.512-5.272-1.406l-.378-.224-3.932.967.984-3.814-.248-.393A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Send order via WhatsApp
              </>
            )}
          </button>
        </form>
      </div>
      <div>
        <OrderSummary items={items} subtotal={subtotal} />
      </div>
    </div>
  );
}
