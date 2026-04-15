-- Allow admin to update orders (for marking as fulfilled)
create policy "Admin update orders" on public.orders
  for update to authenticated using (true) with check (true);
