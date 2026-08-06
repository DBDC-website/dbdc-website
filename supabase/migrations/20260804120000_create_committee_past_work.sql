-- Committee Past Work: yearly entries + bullet items with optional links.

create table if not exists public.committee_past_work_years (
  id bigint generated always as identity primary key,
  committee_slug text not null
    check (committee_slug in ('rdc', 'sc', 'wc', 'cabpag')),
  year integer not null check (year >= 1900 and year <= 2100),
  sort_order integer not null default 0,
  allows_links boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (committee_slug, year)
);

create table if not exists public.committee_past_work_items (
  id bigint generated always as identity primary key,
  year_id bigint not null
    references public.committee_past_work_years (id) on delete cascade,
  text text not null default '',
  text_en text,
  text_zh_hant text,
  text_zh_hans text,
  link_url text,
  file_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_past_work_years_committee
  on public.committee_past_work_years (committee_slug, year);

create index if not exists idx_past_work_items_year
  on public.committee_past_work_items (year_id, sort_order);

alter table public.committee_past_work_years enable row level security;
alter table public.committee_past_work_items enable row level security;

drop policy if exists "Public read past work years" on public.committee_past_work_years;
create policy "Public read past work years" on public.committee_past_work_years
  for select using (true);

drop policy if exists "Admins manage past work years" on public.committee_past_work_years;
create policy "Admins manage past work years" on public.committee_past_work_years
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Public read past work items" on public.committee_past_work_items;
create policy "Public read past work items" on public.committee_past_work_items
  for select using (true);

drop policy if exists "Admins manage past work items" on public.committee_past_work_items;
create policy "Admins manage past work items" on public.committee_past_work_items
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select on public.committee_past_work_years to anon, authenticated;
grant insert, update, delete on public.committee_past_work_years to authenticated;

grant select on public.committee_past_work_items to anon, authenticated;
grant insert, update, delete on public.committee_past_work_items to authenticated;

do $$
begin
  if exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'S' and n.nspname = 'public'
      and c.relname = 'committee_past_work_years_id_seq'
  ) then
    execute 'grant usage, select on sequence public.committee_past_work_years_id_seq to authenticated';
  end if;

  if exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'S' and n.nspname = 'public'
      and c.relname = 'committee_past_work_items_id_seq'
  ) then
    execute 'grant usage, select on sequence public.committee_past_work_items_id_seq to authenticated';
  end if;
end $$;

-- Storage bucket for optional bullet attachments (PDF / image)
insert into storage.buckets (id, name, public)
values ('committee-past-work', 'committee-past-work', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read past work storage" on storage.objects;
create policy "Public read past work storage" on storage.objects
  for select using (bucket_id = 'committee-past-work');

drop policy if exists "Admins upload past work storage" on storage.objects;
create policy "Admins upload past work storage" on storage.objects
  for insert with check (
    bucket_id = 'committee-past-work' and auth.role() = 'authenticated'
  );

drop policy if exists "Admins update past work storage" on storage.objects;
create policy "Admins update past work storage" on storage.objects
  for update using (
    bucket_id = 'committee-past-work' and auth.role() = 'authenticated'
  )
  with check (
    bucket_id = 'committee-past-work' and auth.role() = 'authenticated'
  );

drop policy if exists "Admins delete past work storage" on storage.objects;
create policy "Admins delete past work storage" on storage.objects
  for delete using (
    bucket_id = 'committee-past-work' and auth.role() = 'authenticated'
  );

-- Seed R&DC 2010 example
insert into public.committee_past_work_years (committee_slug, year, sort_order, allows_links)
values ('rdc', 2010, 2010, true)
on conflict (committee_slug, year) do nothing;

insert into public.committee_past_work_items (
  year_id, text, text_en, sort_order
)
select
  y.id,
  v.text_en,
  v.text_en,
  v.sort_order
from public.committee_past_work_years y
cross join (
  values
    (
      1,
      'Soft launch of Catholic Heritage website to test out and solicit support from parishes in the documentation of parish information.'
    ),
    (
      2,
      'Undertaken analysis of Catholic Family Registration (CFR) data to update and supplement the CFR Analysis Report last produced by the Diocese in 2008'
    ),
    (
      3,
      'Produced report: "天主教香港教區教友戶籍登記數據分析2010",September 2010.'
    )
) as v(sort_order, text_en)
where y.committee_slug = 'rdc'
  and y.year = 2010
  and not exists (
    select 1 from public.committee_past_work_items i where i.year_id = y.id
  );

update public.committee_past_work_items i
set link_url = 'https://dbdc.catholic.org.hk/RDC/CFR2010_rev3_cover.pdf'
from public.committee_past_work_years y
where i.year_id = y.id
  and y.committee_slug = 'rdc'
  and y.year = 2010
  and i.sort_order = 3
  and (i.link_url is null or i.link_url = '');
