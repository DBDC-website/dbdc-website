-- CaBPAG annual newsletters: title, month/year, PDF upload and/or external link.

create table if not exists public.cabpag_newsletters (
  id bigint generated always as identity primary key,
  title text not null,
  title_zh_hant text,
  title_zh_hans text,
  published_month integer not null check (published_month between 1 and 12),
  published_year integer not null check (published_year between 1900 and 2100),
  pdf_url text,
  external_url text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cabpag_newsletters_has_source check (
    (pdf_url is not null and btrim(pdf_url) <> '')
    or (external_url is not null and btrim(external_url) <> '')
  )
);

create index if not exists cabpag_newsletters_active_order_idx
  on public.cabpag_newsletters (active, published_year desc, published_month desc, sort_order);

alter table public.cabpag_newsletters enable row level security;

drop policy if exists "Public read cabpag newsletters" on public.cabpag_newsletters;
create policy "Public read cabpag newsletters" on public.cabpag_newsletters
  for select using (active = true or auth.role() = 'authenticated');

drop policy if exists "Admins manage cabpag newsletters" on public.cabpag_newsletters;
create policy "Admins manage cabpag newsletters" on public.cabpag_newsletters
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select on public.cabpag_newsletters to anon, authenticated;
grant insert, update, delete on public.cabpag_newsletters to authenticated;

do $$
begin
  if exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'S' and n.nspname = 'public' and c.relname = 'cabpag_newsletters_id_seq'
  ) then
    execute 'grant usage, select on sequence public.cabpag_newsletters_id_seq to authenticated';
  end if;
end $$;

-- Public PDF storage for newsletter uploads

insert into storage.buckets (id, name, public)
values ('cabpag-newsletters', 'cabpag-newsletters', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read cabpag newsletters storage" on storage.objects;
create policy "Public read cabpag newsletters storage" on storage.objects
  for select using (bucket_id = 'cabpag-newsletters');

drop policy if exists "Admins upload cabpag newsletters storage" on storage.objects;
create policy "Admins upload cabpag newsletters storage" on storage.objects
  for insert with check (
    bucket_id = 'cabpag-newsletters' and auth.role() = 'authenticated'
  );

drop policy if exists "Admins update cabpag newsletters storage" on storage.objects;
create policy "Admins update cabpag newsletters storage" on storage.objects
  for update using (
    bucket_id = 'cabpag-newsletters' and auth.role() = 'authenticated'
  )
  with check (
    bucket_id = 'cabpag-newsletters' and auth.role() = 'authenticated'
  );

drop policy if exists "Admins delete cabpag newsletters storage" on storage.objects;
create policy "Admins delete cabpag newsletters storage" on storage.objects
  for delete using (
    bucket_id = 'cabpag-newsletters' and auth.role() = 'authenticated'
  );
