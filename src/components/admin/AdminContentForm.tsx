"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/client";
import {
  defaultSiteContent,
  normalizeSiteContent,
  SiteContent
} from "@/lib/siteContentShared";

const CONTENT_KEY = "default";
const MAX_PANEL = 6;
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "product-images";

type FormState = {
  store_name: string;
  logo_url: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  cta_primary: string;
  cta_secondary: string;
  why_title: string;
  why_bullets_text: string;
  brand_primary: string;
  brand_primary_strong: string;
  brand_primary_soft: string;
  brand_accent: string;
  brand_accent_soft: string;
};

// Panel slot: either a committed URL or a pending File to upload
type PanelSlot = { url: string; uploading?: false } | { url: string; uploading: true };

const toFormState = (content: SiteContent): FormState => ({
  store_name: content.store_name,
  logo_url: content.logo_url === "/logo.svg" ? "" : content.logo_url,
  hero_badge: content.hero_badge,
  hero_title: content.hero_title,
  hero_subtitle: content.hero_subtitle,
  cta_primary: content.cta_primary,
  cta_secondary: content.cta_secondary,
  why_title: content.why_title,
  why_bullets_text: content.why_bullets.join("\n"),
  brand_primary: content.brand_primary,
  brand_primary_strong: content.brand_primary_strong,
  brand_primary_soft: content.brand_primary_soft,
  brand_accent: content.brand_accent,
  brand_accent_soft: content.brand_accent_soft
});

const parseLines = (text: string) =>
  text.split("\n").map((l) => l.trim()).filter(Boolean);

async function uploadToStorage(file: File): Promise<string> {
  const supabase = supabaseBrowser();
  if (!supabase) throw new Error("Supabase not configured.");
  const path = `panel/${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error("Could not get public URL.");
  return data.publicUrl;
}

// Single upload slot component
function PanelImageSlot({
  index,
  url,
  uploading,
  onUpload,
  onRemove,
  onMoveLeft,
  onMoveRight,
  isFirst,
  isLast
}: {
  index: number;
  url: string;
  uploading?: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onUpload(files[0]);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 transition ${
        dragOver
          ? "border-dashed"
          : url
          ? "border-transparent"
          : "border-dashed border-slate-200"
      }`}
      style={dragOver ? { borderColor: "var(--brand-primary)" } : {}}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
    >
      {/* Slot number badge */}
      <div className="absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-[10px] font-bold text-white">
        {index + 1}
      </div>

      {/* Image or placeholder */}
      <div className="aspect-square w-full bg-sand">
        {uploading ? (
          <div className="flex h-full w-full items-center justify-center">
            <svg className="animate-spin text-slate-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
        ) : url ? (
          <Image src={url} alt={`Panel image ${index + 1}`} fill sizes="200px" className="object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-400 transition hover:text-slate-600"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="text-[10px] font-medium">Add image</span>
          </button>
        )}
      </div>

      {/* Controls shown when image exists */}
      {url && !uploading && (
        <div className="absolute inset-0 flex flex-col justify-between bg-black/0 opacity-0 transition-opacity hover:bg-black/30 hover:opacity-100">
          {/* Top: remove */}
          <div className="flex justify-end p-1.5">
            <button
              type="button"
              onClick={onRemove}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
              title="Remove"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          {/* Bottom: replace + reorder */}
          <div className="flex items-center justify-between p-1.5 gap-1">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={onMoveLeft}
                disabled={isFirst}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-700 transition hover:bg-white disabled:opacity-30"
                title="Move left"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                type="button"
                onClick={onMoveRight}
                disabled={isLast}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-700 transition hover:bg-white disabled:opacity-30"
                title="Move right"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-7 items-center gap-1 rounded-full bg-white/80 px-2 text-[10px] font-semibold text-slate-700 transition hover:bg-white"
              title="Replace image"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Replace
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

export default function AdminContentForm() {
  const [form, setForm] = useState<FormState>(toFormState(defaultSiteContent));
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [panelSlots, setPanelSlots] = useState<PanelSlot[]>(
    Array(MAX_PANEL).fill({ url: "" })
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setError(null);
      const supabase = supabaseBrowser();
      if (!supabase) {
        setError("Supabase env vars are missing. Check .env.local.");
        setLoading(false);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from("site_content")
        .select("*")
        .eq("key", CONTENT_KEY)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        const normalized = normalizeSiteContent(data as Partial<SiteContent>);
        setForm(toFormState(normalized));
        // Populate panel slots from saved URLs
        const slots: PanelSlot[] = Array(MAX_PANEL).fill(null).map((_, i) => ({
          url: normalized.panel_images[i] || ""
        }));
        setPanelSlots(slots);
      }
      setLoading(false);
    };
    loadContent();
  }, []);

  const handlePanelUpload = async (index: number, file: File) => {
    // Show spinner immediately
    setPanelSlots((prev) => {
      const next = [...prev];
      next[index] = { url: prev[index].url, uploading: true };
      return next;
    });
    try {
      const url = await uploadToStorage(file);
      setPanelSlots((prev) => {
        const next = [...prev];
        next[index] = { url };
        return next;
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setPanelSlots((prev) => {
        const next = [...prev];
        next[index] = { url: prev[index].url };
        return next;
      });
      setError(`Image ${index + 1} upload failed: ${msg}`);
    }
  };

  const handlePanelRemove = (index: number) => {
    setPanelSlots((prev) => {
      const next = [...prev];
      next[index] = { url: "" };
      return next;
    });
  };

  const handlePanelMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= MAX_PANEL) return;
    setPanelSlots((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const storeName = form.store_name.trim();
    if (!storeName) {
      setError("Store name is required.");
      return;
    }

    setSaving(true);
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("Supabase env vars are missing. Check .env.local.");
      setSaving(false);
      return;
    }

    // Upload logo if a file was selected
    let logoUrl = form.logo_url.trim() || null;
    if (logoFile) {
      try {
        const path = `branding/${crypto.randomUUID()}-${logoFile.name.replace(/\s+/g, "-")}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, logoFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        if (!data?.publicUrl) throw new Error("No public URL returned.");
        logoUrl = data.publicUrl;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setError(`Logo upload failed: ${msg}`);
        setSaving(false);
        return;
      }
    }

    const panelImageUrls = panelSlots
      .map((s) => s.url.trim())
      .filter(Boolean)
      .slice(0, MAX_PANEL);

    const payload = {
      key: CONTENT_KEY,
      store_name: storeName,
      logo_url: logoUrl,
      hero_badge: form.hero_badge.trim() || null,
      hero_title: form.hero_title.trim() || null,
      hero_subtitle: form.hero_subtitle.trim() || null,
      cta_primary: form.cta_primary.trim() || null,
      cta_secondary: form.cta_secondary.trim() || null,
      why_title: form.why_title.trim() || null,
      why_bullets: parseLines(form.why_bullets_text),
      panel_images: panelImageUrls,
      brand_primary: form.brand_primary.trim() || null,
      brand_primary_strong: form.brand_primary_strong.trim() || null,
      brand_primary_soft: form.brand_primary_soft.trim() || null,
      brand_accent: form.brand_accent.trim() || null,
      brand_accent_soft: form.brand_accent_soft.trim() || null,
      updated_at: new Date().toISOString()
    };

    const { error: saveError } = await supabase
      .from("site_content")
      .upsert(payload, { onConflict: "key" });

    if (saveError) {
      setError(saveError.message);
    } else {
      setForm((prev) => ({ ...prev, logo_url: logoUrl ?? "" }));
      setLogoFile(null);
      setSuccess("Content saved! Reload your storefront to see the changes.");
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="card text-sm text-slate-600">Loading content...</div>;
  }

  const filledCount = panelSlots.filter((s) => s.url).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Storefront text ── */}
      <div className="card space-y-5">
        <div>
          <h2 className="font-medium">Storefront text & branding</h2>
          <p className="text-sm text-slate-500">Store name, hero copy, colors, and logo.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="label">Store name</label>
            <input className="input" value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })} required />
          </div>
          <div className="space-y-1.5">
            <label className="label">Logo URL</label>
            <input className="input" placeholder="https://... or leave blank for default" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="label">Upload logo from device</label>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} />
            {logoFile && <p className="text-xs text-slate-500">Selected: {logoFile.name}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="label">Hero badge</label>
            <input className="input" value={form.hero_badge} onChange={(e) => setForm({ ...form, hero_badge: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="label">Hero title</label>
            <input className="input" value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="label">Hero subtitle</label>
            <textarea className="input min-h-[90px]" value={form.hero_subtitle} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="label">Primary CTA</label>
            <input className="input" value={form.cta_primary} onChange={(e) => setForm({ ...form, cta_primary: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="label">Secondary CTA</label>
            <input className="input" value={form.cta_secondary} onChange={(e) => setForm({ ...form, cta_secondary: e.target.value })} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="label">Why shop here — title</label>
            <input className="input" value={form.why_title} onChange={(e) => setForm({ ...form, why_title: e.target.value })} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="label">Why shop here — bullets (one per line)</label>
            <textarea className="input min-h-[100px]" value={form.why_bullets_text} onChange={(e) => setForm({ ...form, why_bullets_text: e.target.value })} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            { key: "brand_primary" as const, label: "Primary color", placeholder: "#1f6b4f" },
            { key: "brand_primary_strong" as const, label: "Primary strong", placeholder: "#16503b" },
            { key: "brand_primary_soft" as const, label: "Primary soft", placeholder: "#dcefe6" },
            { key: "brand_accent" as const, label: "Accent color", placeholder: "#c7a14a" },
            { key: "brand_accent_soft" as const, label: "Accent soft", placeholder: "#f4ead2" },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="label flex items-center gap-2">
                {label}
                {form[key] && <span className="inline-block h-4 w-4 rounded-full border border-slate-200" style={{ background: form[key] }} />}
              </label>
              <input
                className="input font-mono text-xs"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel images ── */}
      <div className="card space-y-4">
        <div>
          <h2 className="font-medium">Side panel images</h2>
          <p className="text-sm text-slate-500">
            These are the 6 featured scent images shown in the welcome panel when visitors open the site.
            Click a slot to upload from your device, or drag and drop. Hover an image to replace, remove, or reorder it.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array(MAX_PANEL).fill(null).map((_, i) => (
              <div
                key={i}
                className="h-1.5 w-6 rounded-full transition-all"
                style={{ background: panelSlots[i]?.url ? "var(--brand-primary)" : "#e2e8f0" }}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">{filledCount} / {MAX_PANEL} images set</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {panelSlots.map((slot, i) => (
            <PanelImageSlot
              key={i}
              index={i}
              url={slot.url}
              uploading={slot.uploading}
              onUpload={(file) => handlePanelUpload(i, file)}
              onRemove={() => handlePanelRemove(i)}
              onMoveLeft={() => handlePanelMove(i, -1)}
              onMoveRight={() => handlePanelMove(i, 1)}
              isFirst={i === 0}
              isLast={i === MAX_PANEL - 1}
            />
          ))}
        </div>

        <p className="text-xs text-slate-400">
          Images upload instantly to Supabase Storage as you select them. Click Save below to update the live panel.
        </p>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      {success && <p className="rounded-xl px-4 py-3 text-sm font-medium text-emerald-700" style={{ background: "var(--brand-primary-soft)" }}>{success}</p>}

      <button className="btn-primary px-8 py-2.5" type="submit" disabled={saving}>
        {saving ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Saving…
          </span>
        ) : "Save content"}
      </button>
    </form>
  );
}

