-- Extensions
create extension if not exists "pgcrypto";

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12,2) not null,
  description text,
  image_urls text[] default '{}',
  category_id uuid references public.categories (id) on delete set null,
  is_decant boolean default false,
  decant_sizes jsonb,
  in_stock boolean default true,
  created_at timestamptz default now()
);

create index if not exists products_category_idx on public.products (category_id);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  location text not null,
  cart_items jsonb not null,
  total numeric(12,2) not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Site content (single row)
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text unique not null default 'default',
  store_name text not null,
  logo_url text,
  hero_badge text,
  hero_title text,
  hero_subtitle text,
  cta_primary text,
  cta_secondary text,
  why_title text,
  why_bullets text[] default '{}',
  panel_images text[] default '{}',
  brand_primary text,
  brand_primary_strong text,
  brand_primary_soft text,
  brand_accent text,
  brand_accent_soft text,
  updated_at timestamptz default now()
);

-- RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.site_content enable row level security;

-- Public read
create policy "Public read categories" on public.categories
  for select using (true);

create policy "Public read products" on public.products
  for select using (true);

-- Admin manage categories/products
create policy "Admin manage categories" on public.categories
  for all to authenticated using (true) with check (true);

create policy "Admin manage products" on public.products
  for all to authenticated using (true) with check (true);

-- Orders: public insert, admin read
create policy "Public insert orders" on public.orders
  for insert with check (true);

create policy "Admin read orders" on public.orders
  for select to authenticated using (true);

create policy "Public read site content" on public.site_content
  for select using (true);

create policy "Admin manage site content" on public.site_content
  for all to authenticated using (true) with check (true);

-- Storage bucket (run once in Supabase SQL editor)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict do nothing;

-- Storage policies (run once)
create policy "Public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Admin upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

create policy "Admin update product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images');

create policy "Admin delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');
