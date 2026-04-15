export type SiteContent = {
  store_name: string;
  logo_url: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  cta_primary: string;
  cta_secondary: string;
  why_title: string;
  why_bullets: string[];
  panel_images: string[];
  brand_primary: string;
  brand_primary_strong: string;
  brand_primary_soft: string;
  brand_accent: string;
  brand_accent_soft: string;
};

const DEFAULT_PANEL_IMAGES = [
  "https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dw24a244fd/Y0785220/Y0785220_F078524009_E01_RHC.jpg?sw=800",
  "https://www.giorgioarmanibeauty-usa.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-gab-master-catalog/default/dw04d58b00/products/2025/A005%20RESTAGE/3614273955546_01.jpg?q=85&sfrm=jpg&sh=430&sm=cut&sw=430",
  "https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-master-catalog/default/dw3cedbd53/Images2019/Libre%20Eau%20De%20Parfum/90mL/3614272648425.jpg?q=85&sfrm=jpg&sh=320&sm=cut&sw=320",
  "https://cdn.media.amplience.net/i/Marc_Jacobs/MJI_31655513034_000_F8F8F8_4-5_MAIN",
  "https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dw8822db34/Y0996347/Y0996347_C099600764_E01_RHC.jpg?sw=800",
  "https://sdcdn.io/tf/tf_sku_TAJK01_2000x2000_0.png?height=700px&width=700px"
];

export const defaultSiteContent: SiteContent = {
  store_name: "SCENTS FOR CENTS",
  logo_url: "/logo.svg",
  hero_badge: "Nairobi delivery friendly",
  hero_title: "SCENTS FOR CENTS",
  hero_subtitle:
    "Discover fresh arrivals, decants, and everyday favorites. Shop fast, add to cart, and place orders instantly via WhatsApp.",
  cta_primary: "Shop now",
  cta_secondary: "Contact us",
  why_title: "Why shop here?",
  why_bullets: [
    "Authentic scents curated for everyday wear.",
    "Decants available for budget-friendly trials.",
    "Fast WhatsApp ordering and clear summaries."
  ],
  panel_images: DEFAULT_PANEL_IMAGES,
  brand_primary: "#1f6b4f",
  brand_primary_strong: "#16503b",
  brand_primary_soft: "#dcefe6",
  brand_accent: "#c7a14a",
  brand_accent_soft: "#f4ead2"
};

const cleanString = (value: unknown, fallback: string) => {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const cleanStringArray = (
  value: unknown,
  fallback: string[],
  minItems?: number
) => {
  if (!Array.isArray(value)) {
    return fallback;
  }
  const cleaned = value
    .filter((item) => typeof item === "string")
    .map((item) => (item as string).trim())
    .filter(Boolean);
  if (cleaned.length === 0) {
    return fallback;
  }
  if (minItems && cleaned.length < minItems) {
    const merged = [...cleaned];
    for (const item of fallback) {
      if (merged.length >= minItems) {
        break;
      }
      if (!merged.includes(item)) {
        merged.push(item);
      }
    }
    return merged.slice(0, minItems);
  }
  return cleaned;
};

const isHexColor = (value: string) => /^#[0-9A-Fa-f]{6}$/.test(value);

const cleanColor = (value: unknown, fallback: string) => {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return isHexColor(trimmed) ? trimmed : fallback;
};

export const normalizeSiteContent = (
  value?: Partial<SiteContent> | null
): SiteContent => {
  return {
    store_name: cleanString(value?.store_name, defaultSiteContent.store_name),
    logo_url: cleanString(value?.logo_url, defaultSiteContent.logo_url),
    hero_badge: cleanString(value?.hero_badge, defaultSiteContent.hero_badge),
    hero_title: cleanString(value?.hero_title, defaultSiteContent.hero_title),
    hero_subtitle: cleanString(
      value?.hero_subtitle,
      defaultSiteContent.hero_subtitle
    ),
    cta_primary: cleanString(
      value?.cta_primary,
      defaultSiteContent.cta_primary
    ),
    cta_secondary: cleanString(
      value?.cta_secondary,
      defaultSiteContent.cta_secondary
    ),
    why_title: cleanString(value?.why_title, defaultSiteContent.why_title),
    why_bullets: cleanStringArray(
      value?.why_bullets,
      defaultSiteContent.why_bullets,
      3
    ),
    panel_images: cleanStringArray(
      value?.panel_images,
      defaultSiteContent.panel_images,
      6
    ).slice(0, 6),
    brand_primary: cleanColor(
      value?.brand_primary,
      defaultSiteContent.brand_primary
    ),
    brand_primary_strong: cleanColor(
      value?.brand_primary_strong,
      defaultSiteContent.brand_primary_strong
    ),
    brand_primary_soft: cleanColor(
      value?.brand_primary_soft,
      defaultSiteContent.brand_primary_soft
    ),
    brand_accent: cleanColor(value?.brand_accent, defaultSiteContent.brand_accent),
    brand_accent_soft: cleanColor(
      value?.brand_accent_soft,
      defaultSiteContent.brand_accent_soft
    )
  };
};
