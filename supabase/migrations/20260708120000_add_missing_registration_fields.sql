-- Add administratively critical fields identified from the DBDC listing PDFs.

alter table public.consultant_registrations
add column if not exists aacsb_date date,
add column if not exists housing_dept_approved_date date,
add column if not exists audited_accounts_provided boolean not null default false;

alter table public.contractor_registrations
add column if not exists audited_accounts_provided boolean not null default false;

-- Professional registration numbers are stored in the existing
-- professional_details jsonb column (no new columns required).
