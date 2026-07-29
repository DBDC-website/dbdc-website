-- Table-level SELECT grants for the anon/authenticated API roles.
-- RLS already has "Public read articles"; PostgREST still needs explicit grants.
grant select on public.articles to anon, authenticated;
