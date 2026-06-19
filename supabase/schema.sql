-- ============================================================
--  Run this once in the Supabase SQL Editor
--  (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- ============================================================

-- ---- Posts table -------------------------------------------
create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  slug       text not null unique,
  content    text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---- Table privileges (Data API exposure) ------------------
-- Grant the API roles access to the table. This is required because
-- "Automatically expose new tables" is turned off; without it you'll get
-- "permission denied for table posts" even with the policies below.
-- Note: privileges are the first gate; the RLS policies below are the second.
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;

alter table public.posts enable row level security;

-- Anyone can read posts (it's a public blog).
drop policy if exists "Public can read posts" on public.posts;
create policy "Public can read posts"
  on public.posts for select
  using (true);

-- Only signed-in users (you, the admin) can write.
drop policy if exists "Authenticated can insert posts" on public.posts;
create policy "Authenticated can insert posts"
  on public.posts for insert
  to authenticated with check (true);

drop policy if exists "Authenticated can update posts" on public.posts;
create policy "Authenticated can update posts"
  on public.posts for update
  to authenticated using (true) with check (true);

drop policy if exists "Authenticated can delete posts" on public.posts;
create policy "Authenticated can delete posts"
  on public.posts for delete
  to authenticated using (true);

-- ---- Storage bucket for photos -----------------------------
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- Anyone can view images (public bucket).
drop policy if exists "Public can view post images" on storage.objects;
create policy "Public can view post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

-- Only signed-in users can upload / delete images.
drop policy if exists "Authenticated can upload post images" on storage.objects;
create policy "Authenticated can upload post images"
  on storage.objects for insert
  to authenticated with check (bucket_id = 'post-images');

drop policy if exists "Authenticated can delete post images" on storage.objects;
create policy "Authenticated can delete post images"
  on storage.objects for delete
  to authenticated using (bucket_id = 'post-images');
