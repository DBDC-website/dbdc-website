import { createClient } from '@/lib/supabase/server';
import {
  REGISTRATION_BUCKET,
  type RegistrationStatus,
  type RegistrationType,
} from '@/constants/admin';

export type AdminRegistrationListItem = {
  id: number;
  type: RegistrationType;
  companyName: string;
  email: string | null;
  status: RegistrationStatus;
  submittedAt: string;
};

export type AdminContact = {
  id: number;
  name: string;
  position: string | null;
  telephone: string | null;
  signatureName: string | null;
  signatureUrl: string | null;
};

export type AdminPreviousProject = {
  id: number;
  projectName: string;
  projectAddress: string | null;
  contractSum: number | null;
  startDate: string | null;
  endDate: string | null;
  clientName: string | null;
  architectEngineer: string | null;
};

export type AdminRegistrationDetail = {
  id: number;
  type: RegistrationType;
  companyName: string;
  registeredAddress: string | null;
  telephone: string | null;
  fax: string | null;
  email: string | null;
  website: string | null;
  natureOfBusiness: unknown;
  scopeOfServices: string | null;
  businessRegistrationNo: string | null;
  registrationDate: string | null;
  capitalAuthorized: number | null;
  capitalIssued: number | null;
  capitalAvailable: number | null;
  otherApprovedLists: string | null;
  professionalDetails: unknown;
  publishCompany: boolean;
  auditedAccountsProvided: boolean;
  status: RegistrationStatus;
  submittedAt: string;
  signatureUrl: string | null;
  documentUrls: string[];
  contacts: AdminContact[];
  previousProjects: AdminPreviousProject[];
  /** Consultant-only */
  aacsbListed?: boolean;
  aacsbDate?: string | null;
  housingDeptApprovedDate?: string | null;
  /** Contractor-only */
  asdWbApproved?: boolean;
  asdWbDate?: string | null;
  housingDeptApproved?: boolean;
  housingDeptDate?: string | null;
  buildingsDeptRegNo?: string | null;
  buildingsDeptDate?: string | null;
};

function tableFor(type: RegistrationType) {
  return type === 'consultant'
    ? 'consultant_registrations'
    : 'contractor_registrations';
}

function contactsTableFor(type: RegistrationType) {
  return type === 'consultant' ? 'consultant_contacts' : 'contractor_contacts';
}

function projectsTableFor(type: RegistrationType) {
  return type === 'consultant'
    ? 'consultant_previous_projects'
    : 'contractor_previous_projects';
}

function mapListRow(
  type: RegistrationType,
  row: {
    id: number;
    company_name: string;
    email: string | null;
    status: string;
    submitted_at: string;
  },
): AdminRegistrationListItem {
  return {
    id: row.id,
    type,
    companyName: row.company_name,
    email: row.email,
    status: row.status as RegistrationStatus,
    submittedAt: row.submitted_at,
  };
}

export async function listRegistrations(): Promise<AdminRegistrationListItem[]> {
  const supabase = await createClient();

  const [consultants, contractors] = await Promise.all([
    supabase
      .from('consultant_registrations')
      .select('id, company_name, email, status, submitted_at')
      .order('submitted_at', { ascending: false }),
    supabase
      .from('contractor_registrations')
      .select('id, company_name, email, status, submitted_at')
      .order('submitted_at', { ascending: false }),
  ]);

  if (consultants.error) {
    console.error('Failed to list consultant registrations:', consultants.error);
  }
  if (contractors.error) {
    console.error('Failed to list contractor registrations:', contractors.error);
  }

  const items = [
    ...(consultants.data ?? []).map((row) => mapListRow('consultant', row)),
    ...(contractors.data ?? []).map((row) => mapListRow('contractor', row)),
  ];

  return items.sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

export async function getRegistrationDetail(
  type: RegistrationType,
  id: number,
): Promise<AdminRegistrationDetail | null> {
  const supabase = await createClient();

  const { data: registration, error } = await supabase
    .from(tableFor(type))
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`Failed to fetch ${type} registration ${id}:`, error);
    return null;
  }
  if (!registration) return null;

  const [{ data: contacts }, { data: projects }] = await Promise.all([
    supabase
      .from(contactsTableFor(type))
      .select('id, name, position, telephone, signature_name, signature_url')
      .eq('registration_id', id)
      .order('id', { ascending: true }),
    supabase
      .from(projectsTableFor(type))
      .select(
        'id, project_name, project_address, contract_sum, start_date, end_date, client_name, architect_engineer',
      )
      .eq('registration_id', id)
      .order('id', { ascending: true }),
  ]);

  return {
    id: registration.id,
    type,
    companyName: registration.company_name,
    registeredAddress: registration.registered_address,
    telephone: registration.telephone,
    fax: registration.fax,
    email: registration.email,
    website: registration.website,
    natureOfBusiness: registration.nature_of_business,
    scopeOfServices: registration.scope_of_services,
    businessRegistrationNo: registration.business_registration_no,
    registrationDate: registration.registration_date,
    capitalAuthorized: registration.capital_authorized,
    capitalIssued: registration.capital_issued,
    capitalAvailable: registration.capital_available,
    otherApprovedLists: registration.other_approved_lists,
    professionalDetails: registration.professional_details,
    publishCompany: registration.publish_company,
    auditedAccountsProvided: registration.audited_accounts_provided,
    status: registration.status as RegistrationStatus,
    submittedAt: registration.submitted_at,
    signatureUrl: registration.signature_url,
    documentUrls: asStringArray(registration.document_urls),
    contacts: (contacts ?? []).map((contact) => ({
      id: contact.id,
      name: contact.name,
      position: contact.position,
      telephone: contact.telephone,
      signatureName: contact.signature_name,
      signatureUrl: contact.signature_url,
    })),
    previousProjects: (projects ?? []).map((project) => ({
      id: project.id,
      projectName: project.project_name,
      projectAddress: project.project_address,
      contractSum: project.contract_sum,
      startDate: project.start_date,
      endDate: project.end_date,
      clientName: project.client_name,
      architectEngineer: project.architect_engineer,
    })),
    aacsbListed: registration.aacsb_listed,
    aacsbDate: registration.aacsb_date,
    housingDeptApprovedDate: registration.housing_dept_approved_date,
    asdWbApproved: registration.asd_wb_approved,
    asdWbDate: registration.asd_wb_date,
    housingDeptApproved: registration.housing_dept_approved,
    housingDeptDate: registration.housing_dept_date,
    buildingsDeptRegNo: registration.buildings_dept_reg_no,
    buildingsDeptDate: registration.buildings_dept_date,
  };
}

/** Turn stored `registration-documents/...` paths into time-limited signed URLs. */
export async function createSignedAssetUrl(
  storedPath: string | null | undefined,
  expiresInSeconds = 60 * 60,
): Promise<string | null> {
  if (!storedPath) return null;

  const supabase = await createClient();
  const prefix = `${REGISTRATION_BUCKET}/`;
  const objectPath = storedPath.startsWith(prefix)
    ? storedPath.slice(prefix.length)
    : storedPath;

  const { data, error } = await supabase.storage
    .from(REGISTRATION_BUCKET)
    .createSignedUrl(objectPath, expiresInSeconds);

  if (error) {
    console.error('Failed to create signed URL:', error);
    return null;
  }

  return data.signedUrl;
}

export async function createSignedAssetUrls(
  storedPaths: string[],
): Promise<Array<{ path: string; url: string | null }>> {
  return Promise.all(
    storedPaths.map(async (path) => ({
      path,
      url: await createSignedAssetUrl(path),
    })),
  );
}
