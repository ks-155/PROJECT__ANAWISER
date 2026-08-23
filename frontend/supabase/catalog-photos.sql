-- Optional second copy of catalog photos (object storage, not table rows).
-- Run in the Supabase SQL editor, then:
--   set SUPABASE_SERVICE_ROLE_KEY in frontend/.env.local
--   cd frontend && npm run datasets:publish
--
-- Postgres is for shop prices. Image files stay in Storage / Vercel CDN.

insert into storage.buckets (id, name, public)
values ('catalog-photos', 'catalog-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "catalog photos public read" on storage.objects;
create policy "catalog photos public read"
on storage.objects
for select
using (bucket_id = 'catalog-photos');
