import { z } from 'zod';
import type { Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';

/**
 * Validation schemas for the consultant and contractor registration forms.
 *
 * Scalar fields are kept as strings on the client (matching native inputs) and
 * converted to numbers / dates / null inside the server action.
 */

// --- Selectable options (surfaced in the UI; values stay English for storage) -

export const CONSULTANT_NATURE_OPTIONS = [
  'Architecture',
  'Quantity Surveyor',
  'Heritage',
  'Geotechnical Engineering',
  'Building Surveyor',
  'Interior Design',
  'Structural Engineering',
  'Landscaping / Horticulture',
  'Others',
  'Building Services Engineering',
  'Land / Topographic Surveyor',
] as const;

/** † = Registered under Buildings Department (not a required-field marker). */
export const CONTRACTOR_NATURE_OPTIONS = [
  { label: 'General Building contractor', value: 'General Building contractor', bdRegistered: true },
  { label: 'Demolition contractor', value: 'Demolition contractor', bdRegistered: true },
  { label: 'Foundation contractor', value: 'Foundation contractor', bdRegistered: true },
  {
    label: 'Site formation / geotechnical contractor',
    value: 'Site formation / geotechnical contractor',
    bdRegistered: true,
  },
  { label: 'Ventilation contractor', value: 'Ventilation contractor', bdRegistered: true },
  { label: 'Ground investigation contractor', value: 'Ground investigation contractor', bdRegistered: true },
  { label: 'Repair & maintenance contractor', value: 'Repair & maintenance contractor', bdRegistered: false },
  { label: 'Interior fitting out contractor', value: 'Interior fitting out contractor', bdRegistered: false },
  { label: 'Landscaping / horticulture contractor', value: 'Landscaping / horticulture contractor', bdRegistered: false },
  { label: 'Air-conditioning contractor', value: 'Air-conditioning contractor', bdRegistered: false },
  { label: 'Fire services contractor', value: 'Fire services contractor', bdRegistered: false },
  { label: 'Plumbing & drainage contractor', value: 'Plumbing & drainage contractor', bdRegistered: false },
  { label: 'Electrical contractor', value: 'Electrical contractor', bdRegistered: false },
  { label: 'Lift & escalator contractor', value: 'Lift & escalator contractor', bdRegistered: false },
  { label: 'Others (please specify)', value: 'Others', bdRegistered: false },
] as const;

export const CONTRACTOR_MINOR_WORKS_OPTIONS = [
  'Minor Works I',
  'Minor Works II',
  'Minor Works III',
] as const;

export const AUTHORIZED_PERSON_CATEGORIES = ['I', 'II', 'III'] as const;

function buildRegistrationSchemas(locale: Locale) {
  const optionalText = z.string().trim().max(2000).optional();

  const optionalUrl = z
    .union([
      z.literal(''),
      z.url(t(locale, 'forms.errors.invalidUrl')),
    ])
    .optional();

  const optionalDate = z
    .union([
      z.literal(''),
      z.iso.date(t(locale, 'forms.errors.invalidDate')),
    ])
    .optional();

  const optionalCapitalText = z.string().trim().max(80).optional();

  const documentUrlsSchema = z.array(z.string().trim().min(1));

  const otherApprovedListEntrySchema = z.object({
    listName: optionalText,
    listedDate: optionalDate,
    documentUrls: documentUrlsSchema,
  });

  const previousProjectUploadEntrySchema = z.object({
    documentUrls: documentUrlsSchema,
  });

  const contactSchema = z.object({
    name: z.string().trim().max(200),
    position: z.string().trim().max(2000),
    telephone: z.string().trim().max(2000),
    signatureUrl: z.string().trim().max(2000),
  });

  const requiredEmail = z
    .string()
    .trim()
    .min(1, t(locale, 'forms.errors.required'))
    .pipe(z.email(t(locale, 'forms.errors.invalidEmail')));

  const requiredTelephone = z
    .string()
    .trim()
    .min(1, t(locale, 'forms.errors.required'))
    .max(80);

  const baseRegistrationShape = {
    companyName: z
      .string()
      .trim()
      .min(1, t(locale, 'forms.errors.companyNameRequired'))
      .max(300),
    registeredAddress: optionalText,
    telephone: requiredTelephone,
    fax: optionalText,
    email: requiredEmail,
    website: optionalUrl,

    scopeOfServices: optionalText,
    businessRegistrationNo: optionalText,
    registrationDate: optionalDate,

    capitalAuthorized: optionalCapitalText,
    capitalIssued: optionalCapitalText,
    capitalAvailable: optionalCapitalText,

    businessRegistrationDocumentUrls: documentUrlsSchema,

    auditedAccountDocumentUrls: documentUrlsSchema,

    contacts: z.array(contactSchema),
    /** Portfolio is collected as document uploads rather than typed rows. */
    previousProjectUploads: z.array(previousProjectUploadEntrySchema),

    /** Required acknowledgement — not persisted as a DB column. */
    privacyAgreed: z.boolean().refine((value) => value === true, {
      message: t(locale, 'forms.errors.privacyRequired'),
    }),
  };

  const otherRegisteredProfessionalSchema = z.object({
    professional: optionalText,
    no: optionalText,
  });

  const consultantProfessionalDetailsSchema = z.object({
    authorizedPersonCategories: z.array(z.enum(AUTHORIZED_PERSON_CATEGORIES)),
    professionalName: optionalText,
    professionalNo: optionalText,
    registeredStructuralEngineer: z.boolean(),
    registeredGeotechnicalEngineer: z.boolean(),
    authorizedLandSurveyor: z.boolean(),
    registeredInspector: z.boolean(),
    registeredEnergyAssessor: z.boolean(),
    otherRegisteredProfessionals: z.array(otherRegisteredProfessionalSchema),
    aacsbDocumentUrls: documentUrlsSchema,
    eacsbDocumentUrls: documentUrlsSchema,
    otherApprovedListEntries: z.array(otherApprovedListEntrySchema),
  });

  const contractorProfessionalDetailsSchema = z.object({
    authorizedPerson: z.boolean(),
    architect: z.boolean(),
    siteEngineer: z.boolean(),
    buildingSurveyor: z.boolean(),
    quantitySurveyor: z.boolean(),
    registeredInspector: z.boolean(),
    registeredEnergyAssessor: z.boolean(),
    otherProfessional: z.boolean(),
    otherProfessionalSpecify: optionalText,
    devbDocumentUrls: documentUrlsSchema,
    otherApprovedListEntries: z.array(otherApprovedListEntrySchema),
  });

  const consultantSchema = z.object({
    ...baseRegistrationShape,
    natureOfBusiness: z.array(z.string()),
    natureOfBusinessOther: optionalText,
    aacsbListed: z.boolean(),
    aacsbDate: optionalDate,
    eacsbListed: z.boolean(),
    eacsbDate: optionalDate,
    professionalDetails: consultantProfessionalDetailsSchema,
  });

  const contractorSchema = z.object({
    ...baseRegistrationShape,
    natureOfBusiness: z.array(z.string()),
    natureOfBusinessOther: optionalText,
    buildingsDeptRegNo: optionalText,
    buildingsDeptDate: optionalDate,
    buildingsDeptDocumentUrls: documentUrlsSchema,
    devbApproved: z.boolean(),
    devbDate: optionalDate,
    professionalDetails: contractorProfessionalDetailsSchema,
  });

  return {
    baseRegistrationSchema: z.object(baseRegistrationShape),
    consultantSchema,
    contractorSchema,
  };
}

export function createConsultantSchema(locale: Locale) {
  return buildRegistrationSchemas(locale).consultantSchema;
}

export function createContractorSchema(locale: Locale) {
  return buildRegistrationSchemas(locale).contractorSchema;
}

export function createBaseRegistrationSchema(locale: Locale) {
  return buildRegistrationSchemas(locale).baseRegistrationSchema;
}

/** English schemas for server-side validation (storage values stay EN). */
export const consultantSchema = createConsultantSchema('en');
export const contractorSchema = createContractorSchema('en');
export const baseRegistrationSchema = createBaseRegistrationSchema('en');

export type ConsultantRegistrationValues = z.infer<typeof consultantSchema>;
export type ContractorRegistrationValues = z.infer<typeof contractorSchema>;
export type BaseRegistrationValues = z.infer<typeof baseRegistrationSchema>;
export type RegistrationContact = ConsultantRegistrationValues['contacts'][number];
export type OtherApprovedListEntry =
  ConsultantRegistrationValues['professionalDetails']['otherApprovedListEntries'][number];
export type OtherRegisteredProfessional =
  ConsultantRegistrationValues['professionalDetails']['otherRegisteredProfessionals'][number];
