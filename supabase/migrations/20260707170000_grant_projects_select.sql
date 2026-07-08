-- Table-level SELECT grants for the anon/authenticated API roles.
-- RLS policies alone are not enough; PostgREST still needs explicit grants.
grant select on public.projects to anon, authenticated;
grant select on public.project_images to anon, authenticated;
