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
/** Must be set in env (Vercel + local). Do not hardcode a Resend sandbox address. */
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL?.trim() || null;
const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ??
  process.env.ADMIN_EMAIL ??
  ''
)
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
  const natureOfBusiness = [...data.natureOfBusiness];
  if (data.natureOfBusinessOther?.trim()) {
    natureOfBusiness.push(`Others: ${data.natureOfBusinessOther.trim()}`);
  }

  const professionalDetails = {
    ...data.professionalDetails,
    natureOfBusinessOther: toNullable(data.natureOfBusinessOther),
    auditedAccountDocumentUrls: data.auditedAccountDocumentUrls,
    businessRegistrationDocumentUrls: data.businessRegistrationDocumentUrls,
  };

  const allDocumentUrls = [
    ...data.businessRegistrationDocumentUrls,
    ...data.auditedAccountDocumentUrls,
    ...data.professionalDetails.aacsbDocumentUrls,
    ...data.professionalDetails.eacsbDocumentUrls,
    ...data.professionalDetails.otherApprovedListEntries.flatMap(
      (entry) => entry.documentUrls,
    ),
  ];

  return {
    company_name: data.companyName.trim(),
    registered_address: toNullable(data.registeredAddress),
    telephone: toNullable(data.telephone),
    fax: toNullable(data.fax),
    email: toNullable(data.email),
    website: toNullable(data.website),
    nature_of_business: natureOfBusiness,
    scope_of_services: toNullable(data.scopeOfServices),
    business_registration_no: toNullable(data.businessRegistrationNo),
    registration_date: toNullable(data.registrationDate),
    capital_authorized: toMoney(data.capitalAuthorized),
    capital_issued: toMoney(data.capitalIssued),
    capital_available: toMoney(data.capitalAvailable),
    aacsb_listed: data.aacsbListed,
    aacsb_date: toNullable(data.aacsbDate),
    housing_dept_approved: data.eacsbListed,
    housing_dept_approved_date: toNullable(data.eacsbDate),
    other_approved_lists: JSON.stringify(
      data.professionalDetails.otherApprovedListEntries,
    ),
    professional_details: professionalDetails,
    publish_company: data.publishCompany,
    audited_accounts_provided: data.auditedAccountsProvided,
    signature_url: data.contacts[0]?.signatureUrl ?? null,
    document_urls: allDocumentUrls,
  };
}

function mapContractorRegistration(data: ContractorRegistrationValues) {
  const natureOfBusiness = [...data.natureOfBusiness];
  if (data.natureOfBusinessOther?.trim()) {
    natureOfBusiness.push(`Others: ${data.natureOfBusinessOther.trim()}`);
  }

  const professionalDetails = {
    ...data.professionalDetails,
    natureOfBusinessOther: toNullable(data.natureOfBusinessOther),
    auditedAccountDocumentUrls: data.auditedAccountDocumentUrls,
    businessRegistrationDocumentUrls: data.businessRegistrationDocumentUrls,
    buildingsDeptDocumentUrls: data.buildingsDeptDocumentUrls,
  };

  const allDocumentUrls = [
    ...data.businessRegistrationDocumentUrls,
    ...data.buildingsDeptDocumentUrls,
    ...data.auditedAccountDocumentUrls,
    ...data.professionalDetails.devbDocumentUrls,
    ...data.professionalDetails.otherApprovedListEntries.flatMap(
      (entry) => entry.documentUrls,
    ),
  ];

  return {
    company_name: data.companyName.trim(),
    registered_address: toNullable(data.registeredAddress),
    telephone: toNullable(data.telephone),
    fax: toNullable(data.fax),
    email: toNullable(data.email),
    website: toNullable(data.website),
    nature_of_business: natureOfBusiness,
    scope_of_services: toNullable(data.scopeOfServices),
    business_registration_no: toNullable(data.businessRegistrationNo),
    registration_date: toNullable(data.registrationDate),
    capital_authorized: toMoney(data.capitalAuthorized),
    capital_issued: toMoney(data.capitalIssued),
    capital_available: toMoney(data.capitalAvailable),
    asd_wb_approved: data.devbApproved,
    asd_wb_date: toNullable(data.devbDate),
    housing_dept_approved: false,
    housing_dept_date: null,
    buildings_dept_reg_no: toNullable(data.buildingsDeptRegNo),
    buildings_dept_date: toNullable(data.buildingsDeptDate),
    other_approved_lists: JSON.stringify(
      data.professionalDetails.otherApprovedListEntries,
    ),
    professional_details: professionalDetails,
    publish_company: data.publishCompany,
    audited_accounts_provided: data.auditedAccountsProvided,
    signature_url: data.contacts[0]?.signatureUrl ?? null,
    document_urls: allDocumentUrls,
  };
}

function mapContacts(contacts: ConsultantRegistrationValues['contacts']) {
  return contacts.map((contact) => ({
    name: contact.name.trim(),
    position: toNullable(contact.position),
    telephone: toNullable(contact.telephone),
    signature_name: null,
    signature_url: toNullable(contact.signatureUrl),
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

  if (!FROM_EMAIL) {
    console.warn(
      'RESEND_FROM_EMAIL is not configured; skipping email notifications.',
    );
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
      const adminResult = await resend.emails.send({
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
      console.log(
        'Resend admin email response:',
        JSON.stringify(adminResult, null, 2),
      );
      if (adminResult.error) {
        console.error('Resend admin email error:', adminResult.error);
      }
    } else {
      console.warn(
        'ADMIN_EMAIL / ADMIN_EMAILS is not configured; skipping admin notification.',
      );
    }

    if (normalizedApplicantEmail) {
      const applicantResult = await resend.emails.send({
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
      console.log(
        'Resend applicant email response:',
        JSON.stringify(applicantResult, null, 2),
      );
      if (applicantResult.error) {
        console.error('Resend applicant email error:', applicantResult.error);
      }
    } else {
      console.warn(
        'Applicant email missing on registration; skipping confirmation email.',
      );
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
