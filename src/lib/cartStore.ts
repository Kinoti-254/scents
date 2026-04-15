import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "@/lib/types";

const makeKey = (productId: string, variant?: string | null) =>
  variant ? `${productId}::${variant}` : productId;

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key" | "quantity"> & { quantity?: number }) => void;
  removeItem: (key: string) => void;
  increment: (key: string) => void;
  decrement: (key: string) => void;
  clear: () => void;
  subtotal: () => number;
  totalItems: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const key = makeKey(item.product_id, item.variant);
          const existing = state.items.find((cartItem) => cartItem.key === key);
          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.key === key
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + (item.quantity ?? 1)
                    }
                  : cartItem
              )
            };
          }
          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: item.quantity ?? 1,
                key
              }
            ]
          };
        }),
      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((item) => item.key !== key)
        })),
      increment: (key) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key ? { ...item, quantity: item.quantity + 1 } : item
          )
        })),
      decrement: (key) =>
        set((state) => ({
          items: state.items.flatMap((item) => {
            if (item.key !== key) return [item];
            const nextQty = item.quantity - 1;
            if (nextQty <= 0) return [];
            return [{ ...item, quantity: nextQty }];
          })
        })),
      clear: () => set({ items: [] }),
      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0)
    }),
    {
      name: "sams-perfume-cart",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
