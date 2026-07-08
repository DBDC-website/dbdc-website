-- Table-level privilege grants for the registration tables.
-- RLS policies decide *which rows* a role may touch, but PostgREST still needs
-- explicit table privileges. Without these, public form submissions fail with
-- "permission denied for table ..." (SQLSTATE 42501).

-- Public (anon) + authenticated may submit registrations and their child rows.
grant insert on public.consultant_registrations to anon, authenticated;
grant insert on public.consultant_contacts to anon, authenticated;
grant insert on public.consultant_previous_projects to anon, authenticated;
grant insert on public.contractor_registrations to anon, authenticated;
grant insert on public.contractor_contacts to anon, authenticated;
grant insert on public.contractor_previous_projects to anon, authenticated;

-- Admins (authenticated) may review submissions and update application status.
grant select, update on public.consultant_registrations to authenticated;
grant select on public.consultant_contacts to authenticated;
grant select on public.consultant_previous_projects to authenticated;
grant select, update on public.contractor_registrations to authenticated;
grant select on public.contractor_contacts to authenticated;
grant select on public.contractor_previous_projects to authenticated;
