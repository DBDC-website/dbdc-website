-- =====================================================
-- STORAGE BUCKET
-- =====================================================
insert into storage.buckets (id, name, public)
values ('registration-documents', 'registration-documents', false)
on conflict (id) do nothing;

-- =====================================================
-- RLS POLICIES FOR CONSULTANTS
-- =====================================================
alter table public.consultant_registrations enable row level security;
alter table public.consultant_contacts enable row level security;
alter table public.consultant_previous_projects enable row level security;

-- Public can INSERT (submit form)
create policy "Public insert consultants" on public.consultant_registrations
    for insert with check (true);
create policy "Public insert consultant contacts" on public.consultant_contacts
    for insert with check (true);
create policy "Public insert consultant projects" on public.consultant_previous_projects
    for insert with check (true);

-- Only authenticated (admins) can read consultants
create policy "Admins read consultants" on public.consultant_registrations
    for select using (auth.role() = 'authenticated');
create policy "Admins read consultant contacts" on public.consultant_contacts
    for select using (auth.role() = 'authenticated');
create policy "Admins read consultant projects" on public.consultant_previous_projects
    for select using (auth.role() = 'authenticated');

-- Admins can update consultants (approve/reject)
create policy "Admins update consultants" on public.consultant_registrations
    for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =====================================================
-- RLS POLICIES FOR CONTRACTORS
-- =====================================================
alter table public.contractor_registrations enable row level security;
alter table public.contractor_contacts enable row level security;
alter table public.contractor_previous_projects enable row level security;

-- Public can INSERT (submit form)
create policy "Public insert contractors" on public.contractor_registrations
    for insert with check (true);
create policy "Public insert contractor contacts" on public.contractor_contacts
    for insert with check (true);
create policy "Public insert contractor projects" on public.contractor_previous_projects
    for insert with check (true);

-- Only authenticated (admins) can read contractors
create policy "Admins read contractors" on public.contractor_registrations
    for select using (auth.role() = 'authenticated');
create policy "Admins read contractor contacts" on public.contractor_contacts
    for select using (auth.role() = 'authenticated');
create policy "Admins read contractor projects" on public.contractor_previous_projects
    for select using (auth.role() = 'authenticated');

-- Admins can update contractors (approve/reject)
create policy "Admins update contractors" on public.contractor_registrations
    for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage: Public can upload to this bucket, but only admins can read/download
create policy "Public upload registration docs" on storage.objects
    for insert with check (bucket_id = 'registration-documents');

create policy "Admins manage registration docs" on storage.objects
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');