'use server';

import { supabase } from '@/lib/supabaseClient';
import {
  consultantSchema,
  contractorSchema,
  type ConsultantRegistrationValues,
  type ContractorRegistrationValues,
} from '@/lib/validations/registration';

export type RegistrationResult =
  | { ok: true; id: number }
  | { ok: false; message: string };

function toMoney(value?: string): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toNullable(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function mapConsultantRegistration(data: ConsultantRegistrationValues) {
  return {
    company_name: data.companyName.trim(),
    registered_address: toNullable(data.registeredAddress),
    telephone: toNullable(data.telephone),
    fax: toNullable(data.fax),
    email: toNullable(data.email),
    website: toNullable(data.website),
    nature_of_business: data.natureOfBusiness,
    scope_of_services: toNullable(data.scopeOfServices),
    business_registration_no: toNullable(data.businessRegistrationNo),
    registration_date: toNullable(data.registrationDate),
    capital_authorized: toMoney(data.capitalAuthorized),
    capital_issued: toMoney(data.capitalIssued),
    capital_available: toMoney(data.capitalAvailable),
    aacsb_listed: data.aacsbListed,
    aacsb_date: toNullable(data.aacsbDate),
    housing_dept_approved: data.housingDeptApproved,
    housing_dept_approved_date: toNullable(data.housingDeptApprovedDate),
    other_approved_lists: toNullable(data.otherApprovedLists),
    professional_details: data.professionalDetails,
    publish_company: data.publishCompany,
    audited_accounts_provided: data.auditedAccountsProvided,
  };
}

function mapContractorRegistration(data: ContractorRegistrationValues) {
  return {
    company_name: data.companyName.trim(),
    registered_address: toNullable(data.registeredAddress),
    telephone: toNullable(data.telephone),
    fax: toNullable(data.fax),
    email: toNullable(data.email),
    website: toNullable(data.website),
    nature_of_business: data.natureOfBusiness,
    scope_of_services: toNullable(data.scopeOfServices),
    business_registration_no: toNullable(data.businessRegistrationNo),
    registration_date: toNullable(data.registrationDate),
    capital_authorized: toMoney(data.capitalAuthorized),
    capital_issued: toMoney(data.capitalIssued),
    capital_available: toMoney(data.capitalAvailable),
    asd_wb_approved: data.asdWbApproved,
    asd_wb_date: toNullable(data.asdWbDate),
    housing_dept_approved: data.housingDeptApproved,
    housing_dept_date: toNullable(data.housingDeptDate),
    buildings_dept_reg_no: toNullable(data.buildingsDeptRegNo),
    buildings_dept_date: toNullable(data.buildingsDeptDate),
    other_approved_lists: toNullable(data.otherApprovedLists),
    professional_details: data.professionalDetails,
    publish_company: data.publishCompany,
    audited_accounts_provided: data.auditedAccountsProvided,
  };
}

function mapContacts(contacts: ConsultantRegistrationValues['contacts']) {
  return contacts.map((contact) => ({
    name: contact.name.trim(),
    position: toNullable(contact.position),
    telephone: toNullable(contact.telephone),
    signature_name: toNullable(contact.signatureName),
  }));
}

function mapProjects(projects: ConsultantRegistrationValues['previousProjects']) {
  return projects.map((project) => ({
    project_name: project.projectName.trim(),
    project_address: toNullable(project.projectAddress),
    contract_sum: toMoney(project.contractSum),
    start_date: toNullable(project.startDate),
    end_date: toNullable(project.endDate),
    client_name: toNullable(project.clientName),
    architect_engineer: toNullable(project.architectEngineer),
  }));
}

export async function submitConsultantRegistration(
  values: ConsultantRegistrationValues,
): Promise<RegistrationResult> {
  const parsed = consultantSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: 'Some fields are invalid. Please review the form.' };
  }

  const data = parsed.data;

  const { data: registrationId, error } = await supabase.rpc(
    'submit_consultant_registration',
    {
      registration: mapConsultantRegistration(data),
      contacts: mapContacts(data.contacts),
      projects: mapProjects(data.previousProjects),
    },
  );

  if (error || registrationId == null) {
    console.error('Consultant registration RPC failed:', error);
    return { ok: false, message: 'Could not submit your registration. Please try again.' };
  }

  return { ok: true, id: registrationId as number };
}

export async function submitContractorRegistration(
  values: ContractorRegistrationValues,
): Promise<RegistrationResult> {
  const parsed = contractorSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: 'Some fields are invalid. Please review the form.' };
  }

  const data = parsed.data;

  const { data: registrationId, error } = await supabase.rpc(
    'submit_contractor_registration',
    {
      registration: mapContractorRegistration(data),
      contacts: mapContacts(data.contacts),
      projects: mapProjects(data.previousProjects),
    },
  );

  if (error || registrationId == null) {
    console.error('Contractor registration RPC failed:', error);
    return { ok: false, message: 'Could not submit your registration. Please try again.' };
  }

  return { ok: true, id: registrationId as number };
}
