-- Admin content management: projects + committee_members write access,
-- and authenticated uploads to the public project-images bucket.

-- PROJECTS / PROJECT_IMAGES RLS + GRANTS

alter table public.projects enable row level security;
alter table public.project_images enable row level security;

drop policy if exists "Public read published projects" on public.projects;
create policy "Public read published projects" on public.projects
  for select using (published = true or auth.role() = 'authenticated');

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects" on public.projects
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Public read project images" on public.project_images;
create policy "Public read project images" on public.project_images
  for select using (true);

drop policy if exists "Admins manage project images" on public.project_images;
create policy "Admins manage project images" on public.project_images
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

grant select on public.project_images to anon, authenticated;
grant insert, update, delete on public.project_images to authenticated;

-- Identity / serial sequences used by inserts
do $$
begin
  if exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'S' and n.nspname = 'public' and c.relname = 'projects_id_seq'
  ) then
    execute 'grant usage, select on sequence public.projects_id_seq to authenticated';
  end if;

  if exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'S' and n.nspname = 'public' and c.relname = 'project_images_id_seq'
  ) then
    execute 'grant usage, select on sequence public.project_images_id_seq to authenticated';
  end if;
end $$;


-- COMMITTEE MEMBERS WRITE GRANTS
-- (RLS policies already exist from create_committee_members_table)

grant select on public.committee_members to anon, authenticated;
grant insert, update, delete on public.committee_members to authenticated;

do $$
begin
  if exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'S' and n.nspname = 'public' and c.relname = 'committee_members_id_seq'
  ) then
    execute 'grant usage, select on sequence public.committee_members_id_seq to authenticated';
  end if;
end $$;


-- PROJECT IMAGE STORAGE

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read project images storage" on storage.objects;
create policy "Public read project images storage" on storage.objects
  for select using (bucket_id = 'project-images');

drop policy if exists "Admins upload project images storage" on storage.objects;
create policy "Admins upload project images storage" on storage.objects
  for insert with check (
    bucket_id = 'project-images' and auth.role() = 'authenticated'
  );

drop policy if exists "Admins update project images storage" on storage.objects;
create policy "Admins update project images storage" on storage.objects
  for update using (
    bucket_id = 'project-images' and auth.role() = 'authenticated'
  )
  with check (
    bucket_id = 'project-images' and auth.role() = 'authenticated'
  );

drop policy if exists "Admins delete project images storage" on storage.objects;
create policy "Admins delete project images storage" on storage.objects
  for delete using (
    bucket_id = 'project-images' and auth.role() = 'authenticated'
  );
