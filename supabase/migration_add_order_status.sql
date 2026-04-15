-- Run this in your Supabase SQL editor if you already have an orders table
-- It adds a 'status' column to track order lifecycle

alter table public.orders
  add column if not exists status text not null default 'pending';

-- Optional: add a check constraint to restrict valid values
-- alter table public.orders
--   add constraint orders_status_check
--   check (status in ('pending', 'confirmed', 'delivering', 'delivered', 'cancelled'));
