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

/** Strip quotes / trailing comments that often break Vercel env values. */
function sanitizeEnvValue(value: string | undefined | null): string | null {
  if (!value) return null;
  const trimmed = value.trim().replace(/^['"]+|['"]+$/g, '').trim();
  const withoutComment = trimmed.split(/\s+#/)[0]?.trim() ?? '';
  return withoutComment || null;
}

function isValidFromAddress(value: string): boolean {
  // Resend accepts `email@example.com` or `Name <email@example.com>`.
  return (
    /^[^\s<>]+@[^\s<>]+\.[^\s<>]+$/.test(value) ||
    /^[^<>]+\s<[^\s<>]+@[^\s<>]+\.[^\s<>]+>$/.test(value)
  );
}

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
/** Must be set in env (Vercel + local). Do not hardcode a Resend sandbox address. */
const FROM_EMAIL = sanitizeEnvValue(process.env.RESEND_FROM_EMAIL);
const ADMIN_EMAIL_LIST = (sanitizeEnvValue(process.env.ADMIN_EMAILS) ?? '')
  .split(',')
  .map((email) => sanitizeEnvValue(email) ?? '')
  .filter(Boolean);
/** Primary inbox (To). Falls back to the first ADMIN_EMAILS address. */
const PRIMARY_ADMIN_EMAIL =
  sanitizeEnvValue(process.env.ADMIN_EMAIL) ?? ADMIN_EMAIL_LIST[0] ?? null;
/** Remaining staff (Cc), excluding the primary inbox. */
const ADMIN_CC_EMAILS = ADMIN_EMAIL_LIST.filter(
  (email) => email.toLowerCase() !== PRIMARY_ADMIN_EMAIL?.toLowerCase(),
);
function toMoney(value?: string): number | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase().replace(/,/g, '');
  if (!normalized) return null;

  const direct = Number(normalized);
  if (Number.isFinite(direct)) return direct;

  const multipliers: Record<string, number> = {
    k: 1_000,
    thousand: 1_000,
    m: 1_000_000,
    million: 1_000_000,
    b: 1_000_000_000,
    billion: 1_000_000_000,
  };

  const match = normalized.match(/^(\d+(?:\.\d+)?)\s*(k|m|b|thousand|million|billion)$/);
  if (!match) return null;
  const base = Number(match[1]);
  const multiplier = multipliers[match[2]];
  if (!Number.isFinite(base) || !multiplier) return null;
  return base * multiplier;
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
    ...data.previousProjectUploads.flatMap((item) => item.documentUrls),
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
    publish_company: false,
    audited_accounts_provided: data.auditedAccountDocumentUrls.length > 0,
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
    ...data.previousProjectUploads.flatMap((item) => item.documentUrls),
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
    publish_company: false,
    audited_accounts_provided: data.auditedAccountDocumentUrls.length > 0,
    signature_url: data.contacts[0]?.signatureUrl ?? null,
    document_urls: allDocumentUrls,
  };
}

function mapContacts(contacts: ConsultantRegistrationValues['contacts']) {
  return contacts
    .filter((contact) => contact.name.trim() || contact.signatureUrl.trim())
    .map((contact) => ({
      name: contact.name.trim() || '—',
      position: toNullable(contact.position),
      telephone: toNullable(contact.telephone),
      signature_name: null,
      signature_url: toNullable(contact.signatureUrl),
    }));
}

/**
 * The RPC accepts typed portfolio rows, but applicants supply their portfolio
 * as document uploads instead, so no rows are written on submission. Historic
 * rows are still read and rendered by the admin panel.
 */
const NO_PREVIOUS_PROJECT_ROWS: never[] = [];

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

  if (!isValidFromAddress(FROM_EMAIL)) {
    console.error(
      'Invalid RESEND_FROM_EMAIL format after sanitization:',
      JSON.stringify(FROM_EMAIL),
      'Expected `email@example.com` or `Name <email@example.com>`.',
    );
    return;
  }

  console.log('Resend using from address:', FROM_EMAIL);

  const submittedAt = new Date().toLocaleString('en-HK', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Hong_Kong',
  });
  const referenceId = buildReferenceId(kind, registrationId);
  const kindLabel = kind === 'consultant' ? 'Consultant' : 'Contractor';
  const normalizedApplicantEmail = applicantEmail?.trim();

  try {
    if (PRIMARY_ADMIN_EMAIL) {
      const adminResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: [PRIMARY_ADMIN_EMAIL],
        ...(ADMIN_CC_EMAILS.length > 0 ? { cc: ADMIN_CC_EMAILS } : {}),
        subject: `[DBDC] New ${kindLabel} Registration — ${companyName}`,
        html: `
          <h2>New registration submission received</h2>
          <p>A new <strong>${kindLabel}</strong> registration has been submitted to DBDC.</p>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Applicant email:</strong> ${normalizedApplicantEmail || 'Not provided'}</p>
          <p><strong>Reference ID:</strong> ${referenceId}</p>
          <p><strong>Submitted at:</strong> ${submittedAt}</p>
          <p>Please review this application in the DBDC Admin Panel.</p>
        `,
      });
      console.log('Resend admin email to:', PRIMARY_ADMIN_EMAIL);
      console.log('Resend admin email cc:', ADMIN_CC_EMAILS);
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
        subject: `DBDC Registration Acknowledgement — ${referenceId}`,
        html: `
          <h2>Registration Received!</h2>
          <p>Dear ${companyName},</p>
          <p>Thank you for your submission. Your ${kindLabel.toLowerCase()} registration has been received and is now under review by the DBDC team.</p>
          <p><strong>Reference ID:</strong> ${referenceId}</p>
          <p>We will contact you if any additional information is required.</p>
          <p>If you have any questions, please email <a href="mailto:office@hkdbdc.org.hk">office@hkdbdc.org.hk</a> and quote your reference ID.</p>
          <p>Regards,<br/>HKDBDC Office</p>
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
      projects: NO_PREVIOUS_PROJECT_ROWS,
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
      projects: NO_PREVIOUS_PROJECT_ROWS,
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
