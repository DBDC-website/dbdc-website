create table if not exists public.project_images (
    id bigint generated always as identity primary key,
    project_id bigint not null references public.projects(id) on delete cascade,
    image_url text not null,
    caption text,
    image_type text not null check (image_type in ('before', 'after', 'gallery')),
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

create index if not exists idx_images_project on public.project_images(project_id);
create index if not exists idx_images_sort on public.project_images(sort_order);