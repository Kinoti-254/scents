-- Sample categories
insert into public.categories (name)
values
  ('Fresh'),
  ('Floral'),
  ('Woody'),
  ('Decants')
on conflict (name) do nothing;

-- Default site content
insert into public.site_content (
  key,
  store_name,
  logo_url,
  hero_badge,
  hero_title,
  hero_subtitle,
  cta_primary,
  cta_secondary,
  why_title,
  why_bullets,
  panel_images,
  brand_primary,
  brand_primary_strong,
  brand_primary_soft,
  brand_accent,
  brand_accent_soft
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
  '#1f6b4f',
  '#16503b',
  '#dcefe6',
  '#c7a14a',
  '#f4ead2'
)
on conflict (key) do nothing;

-- Sample products (official brand products with official product photos)
-- Replace image URLs with your own product photos when ready.

with
  fresh as (select id from public.categories where name = 'Fresh' limit 1),
  floral as (select id from public.categories where name = 'Floral' limit 1),
  woody as (select id from public.categories where name = 'Woody' limit 1),
  decants as (select id from public.categories where name = 'Decants' limit 1)
insert into public.products
  (name, price, description, image_urls, category_id, is_decant, decant_sizes, in_stock)
select
  'Sauvage Eau de Parfum',
  13500,
  'Fresh citrus and spice with a smooth vanilla finish.',
  array['https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dw24a244fd/Y0785220/Y0785220_F078524009_E01_RHC.jpg?sw=800'],
  (select id from fresh),
  false,
  null,
  true
where not exists (select 1 from public.products where name = 'Sauvage Eau de Parfum');

with
  fresh as (select id from public.categories where name = 'Fresh' limit 1)
insert into public.products
  (name, price, description, image_urls, category_id, is_decant, decant_sizes, in_stock)
select
  'Acqua Di Gio Eau de Toilette',
  12000,
  'Aquatic freshness with bright citrus and light woods.',
  array['https://www.giorgioarmanibeauty-usa.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-gab-master-catalog/default/dw04d58b00/products/2025/A005%20RESTAGE/3614273955546_01.jpg?q=85&sfrm=jpg&sh=430&sm=cut&sw=430'],
  (select id from fresh),
  false,
  null,
  true
where not exists (select 1 from public.products where name = 'Acqua Di Gio Eau de Toilette');

with
  floral as (select id from public.categories where name = 'Floral' limit 1)
insert into public.products
  (name, price, description, image_urls, category_id, is_decant, decant_sizes, in_stock)
select
  'Libre Eau de Parfum',
  14500,
  'Bold floral lavender with warm vanilla and orange blossom.',
  array['https://www.yslbeautyus.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-ysl-master-catalog/default/dw3cedbd53/Images2019/Libre%20Eau%20De%20Parfum/90mL/3614272648425.jpg?q=85&sfrm=jpg&sh=320&sm=cut&sw=320'],
  (select id from floral),
  false,
  null,
  true
where not exists (select 1 from public.products where name = 'Libre Eau de Parfum');

with
  floral as (select id from public.categories where name = 'Floral' limit 1)
insert into public.products
  (name, price, description, image_urls, category_id, is_decant, decant_sizes, in_stock)
select
  'Daisy Eau de Toilette',
  10500,
  'Soft floral with airy sweetness and a clean finish.',
  array['https://cdn.media.amplience.net/i/Marc_Jacobs/MJI_31655513034_000_F8F8F8_4-5_MAIN'],
  (select id from floral),
  false,
  null,
  true
where not exists (select 1 from public.products where name = 'Daisy Eau de Toilette');

with
  floral as (select id from public.categories where name = 'Floral' limit 1)
insert into public.products
  (name, price, description, image_urls, category_id, is_decant, decant_sizes, in_stock)
select
  'Miss Dior Eau de Parfum',
  16500,
  'Velvety rose, peony, and soft woods with a couture bow finish.',
  array['https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dw8822db34/Y0996347/Y0996347_C099600764_E01_RHC.jpg?sw=800'],
  (select id from floral),
  false,
  null,
  true
where not exists (select 1 from public.products where name = 'Miss Dior Eau de Parfum');

with
  woody as (select id from public.categories where name = 'Woody' limit 1)
insert into public.products
  (name, price, description, image_urls, category_id, is_decant, decant_sizes, in_stock)
select
  'Oud Wood Parfum',
  22000,
  'Rich woods and amber with a smooth, smoky warmth.',
  array['https://sdcdn.io/tf/tf_sku_TAJK01_2000x2000_0.png?height=700px&width=700px'],
  (select id from woody),
  false,
  null,
  true
where not exists (select 1 from public.products where name = 'Oud Wood Parfum');

with
  decants as (select id from public.categories where name = 'Decants' limit 1)
insert into public.products
  (name, price, description, image_urls, category_id, is_decant, decant_sizes, in_stock)
select
  'Sauvage Eau de Parfum Decant',
  900,
  'Official fragrance decants in smaller sizes.',
  array['https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dw24a244fd/Y0785220/Y0785220_F078524009_E01_RHC.jpg?sw=800'],
  (select id from decants),
  true,
  '[{"size_ml": 5, "price": 450}, {"size_ml": 10, "price": 900}, {"size_ml": 20, "price": 1600}]'::jsonb,
  true
where not exists (select 1 from public.products where name = 'Sauvage Eau de Parfum Decant');
