-- Admin management for articles: table writes + PDF storage policies.
-- Public read already exists ("Public read articles" + select grant).

alter table public.articles enable row level security;

drop policy if exists "Public read articles" on public.articles;
create policy "Public read articles" on public.articles
  for select using (true);

drop policy if exists "Admins manage articles" on public.articles;
create policy "Admins manage articles" on public.articles
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select on public.articles to anon, authenticated;
grant insert, update, delete on public.articles to authenticated;

do $$
begin
  if exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'S' and n.nspname = 'public' and c.relname = 'articles_id_seq'
  ) then
    execute 'grant usage, select on sequence public.articles_id_seq to authenticated';
  end if;
end $$;


-- ARTICLE PDF STORAGE (existing bucket used by seeded rows)

insert into storage.buckets (id, name, public)
values ('articles-bucket', 'articles-bucket', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read articles storage" on storage.objects;
create policy "Public read articles storage" on storage.objects
  for select using (bucket_id = 'articles-bucket');

drop policy if exists "Admins upload articles storage" on storage.objects;
create policy "Admins upload articles storage" on storage.objects
  for insert with check (
    bucket_id = 'articles-bucket' and auth.role() = 'authenticated'
  );

drop policy if exists "Admins update articles storage" on storage.objects;
create policy "Admins update articles storage" on storage.objects
  for update using (
    bucket_id = 'articles-bucket' and auth.role() = 'authenticated'
  )
  with check (
    bucket_id = 'articles-bucket' and auth.role() = 'authenticated'
  );

drop policy if exists "Admins delete articles storage" on storage.objects;
create policy "Admins delete articles storage" on storage.objects
  for delete using (
    bucket_id = 'articles-bucket' and auth.role() = 'authenticated'
  );
