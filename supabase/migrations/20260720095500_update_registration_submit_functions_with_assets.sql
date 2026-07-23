-- Update registration RPCs to persist newly added assets columns:
--   - signature_url text
--   - document_urls jsonb

create or replace function public.submit_consultant_registration(
  registration jsonb,
  contacts jsonb,
  projects jsonb
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  registration_id bigint;
  contact jsonb;
  project jsonb;
begin
  insert into consultant_registrations (
    company_name,
    registered_address,
    telephone,
    fax,
    email,
    website,
    nature_of_business,
    scope_of_services,
    business_registration_no,
    registration_date,
    capital_authorized,
    capital_issued,
    capital_available,
    aacsb_listed,
    aacsb_date,
    housing_dept_approved,
    housing_dept_approved_date,
    other_approved_lists,
    professional_details,
    publish_company,
    audited_accounts_provided,
    signature_url,
    document_urls
  )
  values (
    registration->>'company_name',
    nullif(registration->>'registered_address', ''),
    nullif(registration->>'telephone', ''),
    nullif(registration->>'fax', ''),
    nullif(registration->>'email', ''),
    nullif(registration->>'website', ''),
    registration->'nature_of_business',
    nullif(registration->>'scope_of_services', ''),
    nullif(registration->>'business_registration_no', ''),
    nullif(registration->>'registration_date', '')::date,
    nullif(registration->>'capital_authorized', '')::numeric,
    nullif(registration->>'capital_issued', '')::numeric,
    nullif(registration->>'capital_available', '')::numeric,
    coalesce((registration->>'aacsb_listed')::boolean, false),
    nullif(registration->>'aacsb_date', '')::date,
    coalesce((registration->>'housing_dept_approved')::boolean, false),
    nullif(registration->>'housing_dept_approved_date', '')::date,
    nullif(registration->>'other_approved_lists', ''),
    coalesce(registration->'professional_details', '{}'::jsonb),
    coalesce((registration->>'publish_company')::boolean, false),
    coalesce((registration->>'audited_accounts_provided')::boolean, false),
    nullif(registration->>'signature_url', ''),
    coalesce(registration->'document_urls', '[]'::jsonb)
  )
  returning id into registration_id;

  for contact in select * from jsonb_array_elements(coalesce(contacts, '[]'::jsonb))
  loop
    insert into consultant_contacts (
      registration_id,
      name,
      position,
      telephone,
      signature_name
    )
    values (
      registration_id,
      contact->>'name',
      nullif(contact->>'position', ''),
      nullif(contact->>'telephone', ''),
      nullif(contact->>'signature_name', '')
    );
  end loop;

  for project in select * from jsonb_array_elements(coalesce(projects, '[]'::jsonb))
  loop
    insert into consultant_previous_projects (
      registration_id,
      project_name,
      project_address,
      contract_sum,
      start_date,
      end_date,
      client_name,
      architect_engineer
    )
    values (
      registration_id,
      project->>'project_name',
      nullif(project->>'project_address', ''),
      nullif(project->>'contract_sum', '')::numeric,
      nullif(project->>'start_date', '')::date,
      nullif(project->>'end_date', '')::date,
      nullif(project->>'client_name', ''),
      nullif(project->>'architect_engineer', '')
    );
  end loop;

  return registration_id;
end;
$$;

create or replace function public.submit_contractor_registration(
  registration jsonb,
  contacts jsonb,
  projects jsonb
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  registration_id bigint;
  contact jsonb;
  project jsonb;
begin
  insert into contractor_registrations (
    company_name,
    registered_address,
    telephone,
    fax,
    email,
    website,
    nature_of_business,
    scope_of_services,
    business_registration_no,
    registration_date,
    capital_authorized,
    capital_issued,
    capital_available,
    asd_wb_approved,
    asd_wb_date,
    housing_dept_approved,
    housing_dept_date,
    buildings_dept_reg_no,
    buildings_dept_date,
    other_approved_lists,
    professional_details,
    publish_company,
    audited_accounts_provided,
    signature_url,
    document_urls
  )
  values (
    registration->>'company_name',
    nullif(registration->>'registered_address', ''),
    nullif(registration->>'telephone', ''),
    nullif(registration->>'fax', ''),
    nullif(registration->>'email', ''),
    nullif(registration->>'website', ''),
    registration->'nature_of_business',
    nullif(registration->>'scope_of_services', ''),
    nullif(registration->>'business_registration_no', ''),
    nullif(registration->>'registration_date', '')::date,
    nullif(registration->>'capital_authorized', '')::numeric,
    nullif(registration->>'capital_issued', '')::numeric,
    nullif(registration->>'capital_available', '')::numeric,
    coalesce((registration->>'asd_wb_approved')::boolean, false),
    nullif(registration->>'asd_wb_date', '')::date,
    coalesce((registration->>'housing_dept_approved')::boolean, false),
    nullif(registration->>'housing_dept_date', '')::date,
    nullif(registration->>'buildings_dept_reg_no', ''),
    nullif(registration->>'buildings_dept_date', '')::date,
    nullif(registration->>'other_approved_lists', ''),
    coalesce(registration->'professional_details', '{}'::jsonb),
    coalesce((registration->>'publish_company')::boolean, false),
    coalesce((registration->>'audited_accounts_provided')::boolean, false),
    nullif(registration->>'signature_url', ''),
    coalesce(registration->'document_urls', '[]'::jsonb)
  )
  returning id into registration_id;

  for contact in select * from jsonb_array_elements(coalesce(contacts, '[]'::jsonb))
  loop
    insert into contractor_contacts (
      registration_id,
      name,
      position,
      telephone,
      signature_name
    )
    values (
      registration_id,
      contact->>'name',
      nullif(contact->>'position', ''),
      nullif(contact->>'telephone', ''),
      nullif(contact->>'signature_name', '')
    );
  end loop;

  for project in select * from jsonb_array_elements(coalesce(projects, '[]'::jsonb))
  loop
    insert into contractor_previous_projects (
      registration_id,
      project_name,
      project_address,
      contract_sum,
      start_date,
      end_date,
      client_name,
      architect_engineer
    )
    values (
      registration_id,
      project->>'project_name',
      nullif(project->>'project_address', ''),
      nullif(project->>'contract_sum', '')::numeric,
      nullif(project->>'start_date', '')::date,
      nullif(project->>'end_date', '')::date,
      nullif(project->>'client_name', ''),
      nullif(project->>'architect_engineer', '')
    );
  end loop;

  return registration_id;
end;
$$;

revoke all on function public.submit_consultant_registration(jsonb, jsonb, jsonb) from public;
revoke all on function public.submit_contractor_registration(jsonb, jsonb, jsonb) from public;

grant execute on function public.submit_consultant_registration(jsonb, jsonb, jsonb) to anon, authenticated;
grant execute on function public.submit_contractor_registration(jsonb, jsonb, jsonb) to anon, authenticated;
