-- 1. Main Consultant Registration
create table if not exists public.consultant_registrations (
    id bigint generated always as identity primary key,
    company_name text not null,
    registered_address text,
    telephone text,
    fax text,
    email text,
    website text,
    
    -- Consultant-specific fields (from PDF)
    nature_of_business jsonb, -- e.g. ["Architecture", "Structural Engineering"]
    scope_of_services text,
    business_registration_no text,
    registration_date date,
    capital_authorized numeric,
    capital_issued numeric,
    capital_available numeric,
    
    -- Professional registrations (consultant specific)
    aacsb_listed boolean default false,
    housing_dept_approved boolean default false,
    other_approved_lists text,
    
    -- In-house professionals (consultant specific)
    professional_details jsonb, -- e.g. {"architect": true, "structural_engineer": true}
    
    -- Publishing preference
    publish_company boolean not null default false,
    
    -- Admin status
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    
    submitted_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Consultant Contacts (Managers)
create table if not exists public.consultant_contacts (
    id bigint generated always as identity primary key,
    registration_id bigint not null references public.consultant_registrations(id) on delete cascade,
    name text not null,
    position text,
    telephone text,
    signature_name text,
    created_at timestamptz not null default now()
);

-- 3. Consultant Previous Projects (Portfolio)
create table if not exists public.consultant_previous_projects (
    id bigint generated always as identity primary key,
    registration_id bigint not null references public.consultant_registrations(id) on delete cascade,
    project_name text not null,
    project_address text,
    contract_sum numeric,
    start_date date,
    end_date date,
    client_name text,
    architect_engineer text,
    created_at timestamptz not null default now()
);

-- Indexes for consultants
create index idx_consultant_reg_status on public.consultant_registrations(status);
create index idx_consultant_reg_submitted on public.consultant_registrations(submitted_at);
create index idx_consultant_contacts_reg on public.consultant_contacts(registration_id);
create index idx_consultant_projects_reg on public.consultant_previous_projects(registration_id);