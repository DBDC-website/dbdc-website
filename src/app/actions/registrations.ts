'use server';

import { Resend } from 'resend';
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

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'DBDC <onboarding@resend.dev>';
const ADMIN_EMAILS = (process.env.ADMIN_EMAIL ?? '')
  .split(',')
  .map((email) => email.trim())
  .filter(Boolean);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dbdc.catholic.org.hk';

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
    signature_url: toNullable(data.signatureUrl),
    document_urls: data.documentUrls,
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
    signature_url: toNullable(data.signatureUrl),
    document_urls: data.documentUrls,
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

type RegistrationKind = 'consultant' | 'contractor';

function buildReferenceId(kind: RegistrationKind, registrationId: number) {
  return `DBDC-${kind.toUpperCase()}-${registrationId}`;
}

async function sendRegistrationEmails({
  kind,
  registrationId,
  companyName,
  applicantEmail,
}: {
  kind: RegistrationKind;
  registrationId: number;
  companyName: string;
  applicantEmail?: string | null;
}) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not configured; skipping email notifications.');
    return;
  }

  const submittedAt = new Date().toLocaleString('en-HK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const referenceId = buildReferenceId(kind, registrationId);
  const kindLabel = kind === 'consultant' ? 'Consultant' : 'Contractor';
  const normalizedApplicantEmail = applicantEmail?.trim();

  try {
    if (ADMIN_EMAILS.length > 0) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAILS,
        subject: `New ${kindLabel} Registration: ${companyName}`,
        html: `
          <h2>New DBDC registration submitted</h2>
          <p><strong>Type:</strong> ${kindLabel}</p>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Applicant email:</strong> ${normalizedApplicantEmail || 'Not provided'}</p>
          <p><strong>Reference ID:</strong> ${referenceId}</p>
          <p><strong>Submitted:</strong> ${submittedAt}</p>
          <p>Please review this submission in Supabase/Admin panel.</p>
        `,
      });
    }

    if (normalizedApplicantEmail) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [normalizedApplicantEmail],
        subject: 'Your DBDC Registration Has Been Received',
        html: `
          <h2>Thank you for your registration</h2>
          <p>Dear ${companyName},</p>
          <p>Your ${kindLabel.toLowerCase()} registration has been received and is currently under review.</p>
          <p><strong>Reference ID:</strong> ${referenceId}</p>
          <p>If you have questions, please contact us at <a href="mailto:dbdc@catholic.org.hk">dbdc@catholic.org.hk</a>.</p>
          <p>DBDC Office</p>
          <hr />
          <p style="font-size:12px;color:#666">Submitted via ${SITE_URL}</p>
        `,
      });
    }
  } catch (emailError) {
    // Notifications must never block successful registration submission.
    console.error('Email sending failed:', emailError);
  }
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

  await sendRegistrationEmails({
    kind: 'consultant',
    registrationId: registrationId as number,
    companyName: data.companyName.trim(),
    applicantEmail: data.email,
  });

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

  await sendRegistrationEmails({
    kind: 'contractor',
    registrationId: registrationId as number,
    companyName: data.companyName.trim(),
    applicantEmail: data.email,
  });

  return { ok: true, id: registrationId as number };
}
