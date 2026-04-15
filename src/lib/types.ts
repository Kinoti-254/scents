export type Category = {
  id: string;
  name: string;
  created_at?: string;
};

export type DecantSize = {
  size_ml: number;
  price?: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_urls: string[] | null;
  category_id: string | null;
  is_decant?: boolean | null;
  decant_sizes?: DecantSize[] | null;
  in_stock: boolean;
  created_at?: string;
};

export type CartItem = {
  key: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  variant?: string | null;
};
