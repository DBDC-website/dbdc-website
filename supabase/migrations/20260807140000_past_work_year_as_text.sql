-- Allow Past Work year labels like "2018-2021" (not only a single integer).
-- Drop the integer range check before casting, or Postgres fails with
-- "operator does not exist: text >= integer".

alter table public.committee_past_work_years
  drop constraint if exists committee_past_work_years_year_check;

alter table public.committee_past_work_years
  alter column year type text using year::text;

alter table public.committee_past_work_years
  alter column year set not null;

-- Keep unique labels per committee (now as text).
-- unique (committee_slug, year) already exists from the create migration.
