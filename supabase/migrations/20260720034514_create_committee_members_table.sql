-- Committee members table
create table if not exists public.committee_members (
    id bigint generated always as identity primary key,
    committee_slug text not null check (committee_slug in ('dbdc', 'rdc', 'sc', 'wc', 'cabpag')),
    name text not null,
    role text,
    sort_order integer not null default 0,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Indexes for filtering
create index if not exists idx_committee_members_slug on public.committee_members(committee_slug);
create index if not exists idx_committee_members_sort on public.committee_members(sort_order);
create index if not exists idx_committee_members_active on public.committee_members(active);

-- Enable RLS
alter table public.committee_members enable row level security;

-- Public read access
create policy "Public read committee members" on public.committee_members
    for select using (true);

-- Only authenticated admins can write
create policy "Admins manage committee members" on public.committee_members
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');