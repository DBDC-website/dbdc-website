import { z } from 'zod';

/**
 * Validation schemas for the consultant and contractor registration forms.
 *
 * These mirror the Supabase tables created in Sprint 2:
 *   - consultant_registrations / consultant_contacts / consultant_previous_projects
 *   - contractor_registrations / contractor_contacts / contractor_previous_projects
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

const optionalMoney = z
  .string()
  .trim()
  .max(20)
  .optional()
  .refine(
    (value) => !value || /^\d+(\.\d{1,2})?$/.test(value),
    'Enter a valid amount (numbers only)',
  );

// --- Selectable options (surfaced in the UI) --------------------------------

// Options below mirror the DBDC Consultant / Contractor Listing Forms
// (D/DBDC Minor/Form/21).

export const CONSULTANT_NATURE_OPTIONS = [
  'Architecture',
  'Building Surveyor',
  'Structural Engineering',
  'Geotechnical Engineering',
  'Quantity Surveyor',
  'Building Services Engineering',
  'Heritage',
  'Land / Topographic Surveyor',
  'Landscaping / Horticulture',
  'Others',
] as const;

export const CONTRACTOR_NATURE_OPTIONS = [
  'Building Contractor',
  'B.S. Contractor',
  'Civil Contractor',
  'Minor Works I',
  'Minor Works II',
  'Minor Works III',
  'Others',
] as const;

export const CONSULTANT_PROFESSIONAL_OPTIONS = [
  { key: 'authorizedPerson', label: 'Authorised Person (I / II / III)' },
  { key: 'registeredStructuralEngineer', label: 'Registered Structural Engineer' },
  { key: 'registeredGeotechnicalEngineer', label: 'Registered Geotechnical Engineer' },
  { key: 'authorizedLandSurveyor', label: 'Authorised Land Surveyor' },
  { key: 'registeredInspector', label: 'Registered Inspector (R.I.)' },
  { key: 'registeredEnergyAssessor', label: 'Registered Energy Assessor (REA)' },
] as const;

export const CONTRACTOR_PROFESSIONAL_OPTIONS = [
  { key: 'authorizedPerson', label: 'Authorized Person (A.P.)' },
  { key: 'architect', label: 'Architect' },
  { key: 'siteEngineer', label: 'Site Engineer' },
  { key: 'buildingSurveyor', label: 'Building Surveyor' },
  { key: 'quantitySurveyor', label: 'Quantity Surveyor' },
  { key: 'registeredInspector', label: 'Registered Inspector (R.I.)' },
  { key: 'registeredEnergyAssessor', label: 'Registered Energy Assessor (REA)' },
] as const;

// --- Shared child collections ----------------------------------------------

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Contact name is required').max(200),
  position: optionalText,
  telephone: optionalText,
  signatureName: optionalText,
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

  capitalAuthorized: optionalMoney,
  capitalIssued: optionalMoney,
  capitalAvailable: optionalMoney,

  otherApprovedLists: optionalText,
  publishCompany: z.boolean(),
  auditedAccountsProvided: z.boolean(),

  contacts: z
    .array(contactSchema)
    .min(1, 'Add at least one authorised contact'),
  previousProjects: z
    .array(previousProjectSchema)
    .min(3, 'Provide at least three previous projects'),
};

/** Fields common to both registration forms (used to type shared UI sections). */
export const baseRegistrationSchema = z.object(baseRegistrationShape);
export type BaseRegistrationValues = z.infer<typeof baseRegistrationSchema>;

const consultantProfessionalDetailsSchema = z.object({
  authorizedPerson: z.boolean(),
  apRegNo: optionalText,
  registeredStructuralEngineer: z.boolean(),
  registeredGeotechnicalEngineer: z.boolean(),
  authorizedLandSurveyor: z.boolean(),
  registeredInspector: z.boolean(),
  registeredEnergyAssessor: z.boolean(),
  otherProfessional: optionalText,
  otherRegNo: optionalText,
});

const contractorProfessionalDetailsSchema = z.object({
  authorizedPerson: z.boolean(),
  apRegNo: optionalText,
  architect: z.boolean(),
  siteEngineer: z.boolean(),
  buildingSurveyor: z.boolean(),
  quantitySurveyor: z.boolean(),
  registeredInspector: z.boolean(),
  registeredEnergyAssessor: z.boolean(),
  otherProfessional: optionalText,
  otherRegNo: optionalText,
});

// --- Consultant schema ------------------------------------------------------

export const consultantSchema = z.object({
  ...baseRegistrationShape,
  natureOfBusiness: z
    .array(z.string())
    .min(1, 'Select at least one nature of business'),
  aacsbListed: z.boolean(),
  aacsbDate: optionalDate,
  housingDeptApproved: z.boolean(),
  housingDeptApprovedDate: optionalDate,
  professionalDetails: consultantProfessionalDetailsSchema,
});

// --- Contractor schema ------------------------------------------------------

export const contractorSchema = z.object({
  ...baseRegistrationShape,
  natureOfBusiness: z
    .array(z.string())
    .min(1, 'Select at least one nature of business'),
  asdWbApproved: z.boolean(),
  asdWbDate: optionalDate,
  housingDeptApproved: z.boolean(),
  housingDeptDate: optionalDate,
  buildingsDeptRegNo: optionalText,
  buildingsDeptDate: optionalDate,
  professionalDetails: contractorProfessionalDetailsSchema,
});

export type ConsultantRegistrationValues = z.infer<typeof consultantSchema>;
export type ContractorRegistrationValues = z.infer<typeof contractorSchema>;
export type RegistrationContact = z.infer<typeof contactSchema>;
export type RegistrationPreviousProject = z.infer<typeof previousProjectSchema>;
