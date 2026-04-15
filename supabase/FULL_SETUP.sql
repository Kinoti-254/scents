-- ============================================================
-- SCENTS FOR CENTS — Full Supabase Setup
-- Run this ONCE in your Supabase SQL Editor (supabase.com)
-- Go to: SQL Editor → New query → paste all of this → Run
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

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

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  location text not null default 'Not specified',
  cart_items jsonb not null,
  total numeric(12,2) not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

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

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.site_content enable row level security;

-- Drop existing policies before recreating (safe to re-run)
drop policy if exists "Public read categories" on public.categories;
drop policy if exists "Admin manage categories" on public.categories;
drop policy if exists "Public read products" on public.products;
drop policy if exists "Admin manage products" on public.products;
drop policy if exists "Public insert orders" on public.orders;
drop policy if exists "Admin read orders" on public.orders;
drop policy if exists "Public read site content" on public.site_content;
drop policy if exists "Admin manage site content" on public.site_content;

-- Public read
create policy "Public read categories" on public.categories
  for select using (true);

create policy "Public read products" on public.products
  for select using (true);

-- Admin manage
create policy "Admin manage categories" on public.categories
  for all to authenticated using (true) with check (true);

create policy "Admin manage products" on public.products
  for all to authenticated using (true) with check (true);

-- Orders
create policy "Public insert orders" on public.orders
  for insert with check (true);

create policy "Admin read orders" on public.orders
  for select to authenticated using (true);

create policy "Admin update orders" on public.orders
  for update to authenticated using (true) with check (true);

-- Site content
create policy "Public read site content" on public.site_content
  for select using (true);

create policy "Admin manage site content" on public.site_content
  for all to authenticated using (true) with check (true);

-- ============================================================
-- STORAGE BUCKET + POLICIES
-- ============================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
drop policy if exists "Admin upload product images" on storage.objects;
drop policy if exists "Admin update product images" on storage.objects;
drop policy if exists "Admin delete product images" on storage.objects;

create policy "Public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Admin upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

create policy "Admin update product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images');

create policy "Admin delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');

-- ============================================================
-- SEED DATA (only inserts if not already present)
-- ============================================================

insert into public.categories (name)
values ('Fresh'), ('Floral'), ('Woody'), ('Decants')
on conflict (name) do nothing;

insert into public.site_content (
  key, store_name, logo_url, hero_badge, hero_title, hero_subtitle,
  cta_primary, cta_secondary, why_title, why_bullets, panel_images,
  brand_primary, brand_primary_strong, brand_primary_soft,
  brand_accent, brand_accent_soft
)
values (
  'default',
  'SCENTS FOR CENTS',
  '/logo.svg',
  'Nairobi delivery friendly',
  'SCENTS FOR CENTS',
  'Discover fresh arrivals, decants, and everyday favorites. Shop fast, add to cart, and place orders instantly via WhatsApp.',
  'Shop now',
  'Contact us',
  'Why shop here?',
  array[
    'Authentic scents curated for everyday wear.',
    'Decants available for budget-friendly trials.',
    'Fast WhatsApp ordering and clear summaries.'
  ],
  array[
    'https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dw24a244fd/Y0785220/Y0785220_F078524009_E01_RHC.jpg?sw=800',
    'https://www.giorgioarmanibeauty-usa.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-gab-master-catalog/default/dw04d58b00/products/2025/A005%20RESTAGE/3614273955546_01.jpg?q=85&sfrm=jpg&sh=430&sm=cut&sw=430',
    'https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-master-catalog/default/dw3cedbd53/Images2019/Libre%20Eau%20De%20Parfum/90mL/3614272648425.jpg?q=85&sfrm=jpg&sh=320&sm=cut&sw=320',
    'https://cdn.media.amplience.net/i/Marc_Jacobs/MJI_31655513034_000_F8F8F8_4-5_MAIN',
    'https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dw8822db34/Y0996347/Y0996347_C099600764_E01_RHC.jpg?sw=800',
    'https://sdcdn.io/tf/tf_sku_TAJK01_2000x2000_0.png?height=700px&width=700px'
  ],
  '#1f6b4f', '#16503b', '#dcefe6', '#c7a14a', '#f4ead2'
)
on conflict (key) do nothing;

-- Sample products
with fresh as (select id from public.categories where name = 'Fresh' limit 1)
insert into public.products (name, price, description, image_urls, category_id, is_decant, decant_sizes, in_stock)
select 'Sauvage Eau de Parfum', 13500, 'Fresh citrus and spice with a smooth vanilla finish.',
  array['https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dw24a244fd/Y0785220/Y0785220_F078524009_E01_RHC.jpg?sw=800'],
  (select id from fresh), false, null, true
where not exists (select 1 from public.products where name = 'Sauvage Eau de Parfum');

with floral as (select id from public.categories where name = 'Floral' limit 1)
insert into public.products (name, price, description, image_urls, category_id, is_decant, decant_sizes, in_stock)
select 'Libre Eau de Parfum', 14500, 'Bold floral lavender with warm vanilla and orange blossom.',
  array['https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-master-catalog/default/dw3cedbd53/Images2019/Libre%20Eau%20De%20Parfum/90mL/3614272648425.jpg?q=85&sfrm=jpg&sh=320&sm=cut&sw=320'],
  (select id from floral), false, null, true
where not exists (select 1 from public.products where name = 'Libre Eau de Parfum');

with decants as (select id from public.categories where name = 'Decants' limit 1)
insert into public.products (name, price, description, image_urls, category_id, is_decant, decant_sizes, in_stock)
select 'Sauvage Decant', 900, 'Sample decants in 5ml, 10ml, and 20ml sizes.',
  array['https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dw24a244fd/Y0785220/Y0785220_F078524009_E01_RHC.jpg?sw=800'],
  (select id from decants), true,
  '[{"size_ml": 5, "price": 450}, {"size_ml": 10, "price": 900}, {"size_ml": 20, "price": 1600}]'::jsonb,
  true
where not exists (select 1 from public.products where name = 'Sauvage Decant');
