# Anawiser

Private Indian e-commerce price comparison. Next.js app on Vercel, prices via Bright Data, local store data in Supabase, optional Gemini chat.

## Run locally

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Deploy on Vercel

1. Import this GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Add the env vars from `frontend/.env.local.example`.
4. Deploy.

## Supabase tables

```sql
create table products (
  id text primary key,
  url text unique not null,
  name text,
  desired_price numeric,
  attributes jsonb default '{}',
  active boolean default true,
  created_at timestamptz default now()
);

create table snapshots (
  id text primary key,
  product_id text not null references products(id),
  timestamp timestamptz default now(),
  price numeric,
  in_stock boolean,
  currency text default 'INR',
  stock_text text
);

alter table products enable row level security;
alter table snapshots enable row level security;
create policy "public products" on products for all using (true) with check (true);
create policy "public snapshots" on snapshots for all using (true) with check (true);
```
