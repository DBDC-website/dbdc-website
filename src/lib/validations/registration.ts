import { z } from 'zod';

/**
 * Validation schemas for the consultant and contractor registration forms.
 *
 * Scalar fields are kept as strings on the client (matching native inputs) and
 * converted to numbers / dates / null inside the server action.
 */

// --- Reusable field helpers -------------------------------------------------

const optionalText = z.string().trim().max(2000).optional();

const optionalEmail = z
  .union([z.literal(''), z.email('Enter a valid email address')])
  .optional();

const optionalUrl = z
  .union([z.literal(''), z.url('Enter a valid URL (including https://)')])
  .optional();

const optionalDate = z
  .union([z.literal(''), z.iso.date('Enter a valid date')])
  .optional();

const optionalCapitalText = z.string().trim().max(80).optional();
const optionalMoney = z
  .string()
  .trim()
  .max(20)
  .optional()
  .refine(
    (value) => !value || /^\d+(\.\d{1,2})?$/.test(value),
    'Enter a valid amount (numbers only)',
  );

const documentUrlsSchema = z.array(z.string().trim().min(1));

const otherApprovedListEntrySchema = z.object({
  listName: optionalText,
  listedDate: optionalDate,
  documentUrls: documentUrlsSchema,
});

const previousProjectUploadEntrySchema = z.object({
  documentUrls: documentUrlsSchema,
});

// --- Selectable options (surfaced in the UI) --------------------------------

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

// --- Shared child collections ----------------------------------------------

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Contact name is required').max(200),
  position: optionalText,
  telephone: optionalText,
  signatureUrl: z.string().trim().min(1, 'Please provide a signature'),
});

const previousProjectSchema = z.object({
  projectName: z.string().trim().min(1, 'Project name is required').max(300),
  projectAddress: optionalText,
  contractSum: optionalMoney,
  startDate: optionalDate,
  endDate: optionalDate,
  clientName: optionalText,
  architectEngineer: optionalText,
});

const baseRegistrationShape = {
  companyName: z.string().trim().min(1, 'Company name is required').max(300),
  registeredAddress: optionalText,
  telephone: optionalText,
  fax: optionalText,
  email: optionalEmail,
  website: optionalUrl,

  scopeOfServices: optionalText,
  businessRegistrationNo: optionalText,
  registrationDate: optionalDate,

  capitalAuthorized: optionalCapitalText,
  capitalIssued: optionalCapitalText,
  capitalAvailable: optionalCapitalText,

  businessRegistrationDocumentUrls: documentUrlsSchema,

  publishCompany: z.boolean(),
  auditedAccountsProvided: z.boolean(),
  auditedAccountDocumentUrls: documentUrlsSchema,

  contacts: z
    .array(contactSchema)
    .min(1, 'Add at least one authorised contact'),
  previousProjects: z.array(previousProjectSchema),
  previousProjectUploads: z.array(previousProjectUploadEntrySchema),
};

/** Fields common to both registration forms (used to type shared UI sections). */
export const baseRegistrationSchema = z.object(baseRegistrationShape);
export type BaseRegistrationValues = z.infer<typeof baseRegistrationSchema>;

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

// --- Consultant schema ------------------------------------------------------

export const consultantSchema = z.object({
  ...baseRegistrationShape,
  natureOfBusiness: z
    .array(z.string())
    .min(1, 'Select at least one nature of business'),
  natureOfBusinessOther: optionalText,
  aacsbListed: z.boolean(),
  aacsbDate: optionalDate,
  eacsbListed: z.boolean(),
  eacsbDate: optionalDate,
  professionalDetails: consultantProfessionalDetailsSchema,
});

// --- Contractor schema ------------------------------------------------------

export const contractorSchema = z.object({
  ...baseRegistrationShape,
  natureOfBusiness: z
    .array(z.string())
    .min(1, 'Select at least one nature of business'),
  natureOfBusinessOther: optionalText,
  buildingsDeptRegNo: optionalText,
  buildingsDeptDate: optionalDate,
  buildingsDeptDocumentUrls: documentUrlsSchema,
  devbApproved: z.boolean(),
  devbDate: optionalDate,
  professionalDetails: contractorProfessionalDetailsSchema,
});

export type ConsultantRegistrationValues = z.infer<typeof consultantSchema>;
export type ContractorRegistrationValues = z.infer<typeof contractorSchema>;
export type RegistrationContact = z.infer<typeof contactSchema>;
export type RegistrationPreviousProject = z.infer<typeof previousProjectSchema>;
export type OtherApprovedListEntry = z.infer<typeof otherApprovedListEntrySchema>;
export type OtherRegisteredProfessional = z.infer<
  typeof otherRegisteredProfessionalSchema
>;
