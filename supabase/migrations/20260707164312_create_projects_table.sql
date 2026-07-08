-- Create projects table (Curated Portfolio)
create table if not exists public.projects (
    id bigint generated always as identity primary key,
    slug text not null unique,
    title text not null,
    building_name text,
    description text,
    address text,
    parish text,
    deanery text,
    nature_of_work text,
    year integer,
    featured boolean not null default false,
    published boolean not null default false,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Performance indexes for the frontend filters & ordering
create index if not exists idx_projects_featured on public.projects(featured);
create index if not exists idx_projects_published on public.projects(published);
create index if not exists idx_projects_sort_order on public.projects(sort_order);
create index if not exists idx_projects_year on public.projects(year);