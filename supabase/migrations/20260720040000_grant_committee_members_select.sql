-- Table-level SELECT grants for the anon/authenticated API roles.
-- RLS policies alone are not enough; PostgREST still needs explicit grants.
grant select on public.committee_members to anon, authenticated;
