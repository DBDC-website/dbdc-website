-- Admin panel reads/updates registration tables with the authenticated role.
-- Existing policies already allow SELECT/UPDATE for authenticated users
-- (see 20260707180511 / 20260707180520). This migration re-asserts grants
-- so deployments that skipped earlier files still work.

grant select, update on public.consultant_registrations to authenticated;
grant select on public.consultant_contacts to authenticated;
grant select on public.consultant_previous_projects to authenticated;

grant select, update on public.contractor_registrations to authenticated;
grant select on public.contractor_contacts to authenticated;
grant select on public.contractor_previous_projects to authenticated;
