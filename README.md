# SCENTS FOR CENTS

Production-ready MVP storefront for SCENTS FOR CENTS with WhatsApp ordering and optional Supabase order storage.

## Features
- Product browsing with categories
- Product detail page with quantity and optional decant size
- Cart with localStorage persistence (Zustand)
- Order form that opens WhatsApp click-to-chat
- Optional order saving to Supabase
- Admin dashboard for products, categories, and storefront content

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth + Storage)
- Deployed on Vercel

## Setup

### 1) Create Supabase project
Create a new Supabase project and copy the project URL and anon key.

### 2) Database schema
Run the SQL in `supabase/schema.sql` in the Supabase SQL editor.

### 3) Storage bucket
Create a public storage bucket (name: `product-images`).

### 4) Auth (Admin)
Enable Email + Password auth in Supabase. Create an admin user via the Supabase dashboard.

### 5) Environment variables
Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=product-images
NEXT_PUBLIC_WHATSAPP_NUMBER=2547XXXXXXXX
NEXT_PUBLIC_SAVE_ORDERS=true
```

Notes:
- `NEXT_PUBLIC_WHATSAPP_NUMBER` should be digits only, include country code.
- Set `NEXT_PUBLIC_SAVE_ORDERS=false` if you do not want to insert orders into Supabase.

### 6) Install and run
```
npm install
npm run dev
```

### 7) Deploy to Vercel
- Import the repo in Vercel
- Add the environment variables in Vercel project settings
- Deploy

## Admin Usage
- Visit `/admin/login` and sign in with the admin email/password.
- Manage categories and products under `/admin/categories` and `/admin/products`.
- Manage storefront copy and panel images under `/admin/content`.
- Manage storefront theme colors under `/admin/content`.
- Upload images via the product form (stored in Supabase Storage).

## Storefront Content
- The storefront reads content from the `site_content` table (see `supabase/schema.sql`).
- Seed defaults live in `supabase/seed.sql` and can be updated in the admin dashboard.

## Notes
- Guest shopping only, no customer login.
- Orders are placed via WhatsApp and optionally stored in Supabase.


