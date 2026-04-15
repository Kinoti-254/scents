"use client";

import Image from "next/image";
import { useState } from "react";
import { Product, DecantSize } from "@/lib/types";
import { formatKes } from "@/lib/format";
import { useCartStore } from "@/lib/cartStore";
import QuantityStepper from "@/components/QuantityStepper";

export default function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const decantSizes = Array.isArray(product.decant_sizes)
    ? (product.decant_sizes as DecantSize[])
    : [];

  const [selectedSize, setSelectedSize] = useState<DecantSize | null>(
    decantSizes[0] ?? null
  );

  const allImages = product.image_urls ?? [];
  const [activeImage, setActiveImage] = useState(allImages[0] || "");

  const price = selectedSize?.price ?? product.price;
  const variantLabel = selectedSize
    ? `${selectedSize.size_ml}ml`
    : product.is_decant
    ? "Decant"
    : null;

  const handleAdd = () => {
    if (!product.in_stock) return;
    addItem({
      product_id: product.id,
      name: product.name,
      price,
      quantity,
      image_url: activeImage,
      variant: variantLabel
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Image gallery */}
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl bg-sand">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={product.name}
              width={600}
              height={600}
              className="h-96 w-full object-cover"
            />
          ) : (
            <div className="flex h-96 w-full items-center justify-center text-sm text-slate-400">
              No image
            </div>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <span className="badge-oos text-sm px-4 py-1.5">Out of stock</span>
            </div>
          )}
        </div>
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allImages.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => setActiveImage(url)}
                className={`flex-shrink-0 overflow-hidden rounded-xl transition ${
                  activeImage === url
                    ? "ring-2 ring-offset-1"
                    : "opacity-60 hover:opacity-90"
                }`}
                style={activeImage === url ? { outline: "2px solid var(--brand-primary)", outlineOffset: "2px" } : {}}
              >
                <Image
                  src={url}
                  alt={`${product.name} view ${i + 1}`}
                  width={80}
                  height={80}
                  className="h-16 w-16 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="space-y-5">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            {product.is_decant && (
              <span className="inline-flex items-center rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                Decant
              </span>
            )}
            {product.in_stock ? (
              <span className="badge-in">In stock</span>
            ) : (
              <span className="badge-oos">Out of stock</span>
            )}
          </div>
          <h1 className="font-display text-3xl leading-tight">{product.name}</h1>
          <p className="mt-1.5 text-xl font-semibold text-brand">{formatKes(price)}</p>
        </div>

        {product.description && (
          <p className="text-sm leading-relaxed text-slate-600">{product.description}</p>
        )}

        {decantSizes.length > 0 && (
          <div className="space-y-2">
            <label className="label" htmlFor="decant-size">Decant size</label>
            <div className="flex flex-wrap gap-2">
              {decantSizes.map((size) => (
                <button
                  key={size.size_ml}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    selectedSize?.size_ml === size.size_ml
                      ? "border-transparent text-white"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                  style={
                    selectedSize?.size_ml === size.size_ml
                      ? { background: "var(--brand-primary)", borderColor: "var(--brand-primary)" }
                      : {}
                  }
                >
                  {size.size_ml}ml — {formatKes(size.price ?? 0)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <QuantityStepper
            quantity={quantity}
            onIncrement={() => setQuantity((q) => q + 1)}
            onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
          />
          <button
            className={`btn-primary flex flex-1 items-center justify-center gap-2 py-2.5 transition disabled:cursor-not-allowed disabled:opacity-50 ${
              added ? "opacity-90" : ""
            }`}
            onClick={handleAdd}
            disabled={!product.in_stock}
          >
            {added ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Added!
              </>
            ) : (
              product.in_stock ? "Add to cart" : "Out of stock"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

