-- 1. Main Contractor Registration
create table if not exists public.contractor_registrations (
    id bigint generated always as identity primary key,
    company_name text not null,
    registered_address text,
    telephone text,
    fax text,
    email text,
    website text,
    
    -- Contractor-specific fields (from PDF)
    nature_of_business jsonb, -- e.g. ["Building Contractor", "B.S. Contractor", "Minor Works I"]
    scope_of_services text,
    business_registration_no text,
    registration_date date,
    capital_authorized numeric,
    capital_issued numeric,
    capital_available numeric,
    
    -- Contractor specific: Approved Lists
    asd_wb_approved boolean default false,
    asd_wb_date date,
    housing_dept_approved boolean default false,
    housing_dept_date date,
    buildings_dept_reg_no text,
    buildings_dept_date date,
    other_approved_lists text,
    
    -- In-house professionals (contractor specific)
    professional_details jsonb, -- e.g. {"authorized_person": true, "site_engineer": true}
    
    -- Publishing preference
    publish_company boolean not null default false,
    
    -- Admin status
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    
    submitted_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Contractor Contacts (Managers)
create table if not exists public.contractor_contacts (
    id bigint generated always as identity primary key,
    registration_id bigint not null references public.contractor_registrations(id) on delete cascade,
    name text not null,
    position text,
    telephone text,
    signature_name text,
    created_at timestamptz not null default now()
);

-- 3. Contractor Previous Projects (Portfolio)
create table if not exists public.contractor_previous_projects (
    id bigint generated always as identity primary key,
    registration_id bigint not null references public.contractor_registrations(id) on delete cascade,
    project_name text not null,
    project_address text,
    contract_sum numeric,
    start_date date,
    end_date date,
    client_name text,
    architect_engineer text,
    created_at timestamptz not null default now()
);

-- Indexes for contractors
create index idx_contractor_reg_status on public.contractor_registrations(status);
create index idx_contractor_reg_submitted on public.contractor_registrations(submitted_at);
create index idx_contractor_contacts_reg on public.contractor_contacts(registration_id);
create index idx_contractor_projects_reg on public.contractor_previous_projects(registration_id);