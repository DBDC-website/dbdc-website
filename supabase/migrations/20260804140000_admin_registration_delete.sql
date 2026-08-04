-- Allow authenticated admins to delete registration rows.
-- Child contacts / previous projects cascade via FK.

grant delete on public.consultant_registrations to authenticated;
grant delete on public.contractor_registrations to authenticated;

drop policy if exists "Admins delete consultants" on public.consultant_registrations;
create policy "Admins delete consultants" on public.consultant_registrations
  for delete using (auth.role() = 'authenticated');

drop policy if exists "Admins delete contractors" on public.contractor_registrations;
create policy "Admins delete contractors" on public.contractor_registrations
  for delete using (auth.role() = 'authenticated');
