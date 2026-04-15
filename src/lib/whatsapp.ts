import { CartItem } from "@/lib/types";
import { formatKes } from "@/lib/format";

type MessageInput = {
  name: string;
  phone: string;
  location?: string;
  items: CartItem[];
  total: number;
};

export function buildWhatsAppMessage({
  name,
  phone,
  location,
  items,
  total
}: MessageInput) {
  const locationLine = location?.trim() || "Will share on WhatsApp";
  const lines = [
    "New Order:",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Location: ${locationLine}`,
    "Items:",
    ...items.map((item) => {
      const variant = item.variant ? ` (${item.variant})` : "";
      return `- ${item.name}${variant} x${item.quantity} = ${formatKes(
        item.price * item.quantity
      )}`;
    }),
    `Total: ${formatKes(total)}`
  ];

  return lines.join("\n");
}
