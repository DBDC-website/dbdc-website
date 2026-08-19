/**
 * Admin magic-link allowlist from ADMIN_EMAILS (comma-separated).
 */
export function getAdminAllowlist(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(fromEnv)];
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminAllowlist().includes(email.trim().toLowerCase());
}

export const REGISTRATION_BUCKET = 'registration-documents';
export const PROJECT_IMAGES_BUCKET = 'project-images';
export const ARTICLES_BUCKET = 'articles-bucket';
export const CABPAG_NEWSLETTERS_BUCKET = 'cabpag-newsletters';
export const PAST_WORK_BUCKET = 'committee-past-work';

/** Committees that have public detail pages (Past Work CMS). */
export const PAST_WORK_COMMITTEE_OPTIONS = [
  { value: 'rdc', label: 'R&DC' },
  { value: 'sc', label: 'SC' },
  { value: 'wc', label: 'WC' },
  { value: 'cabpag', label: 'CaBPAG' },
] as const;

export type PastWorkAdminSlug =
  (typeof PAST_WORK_COMMITTEE_OPTIONS)[number]['value'];

export function isPastWorkAdminSlug(value: string): value is PastWorkAdminSlug {
  return PAST_WORK_COMMITTEE_OPTIONS.some((option) => option.value === value);
}

export type RegistrationType = 'consultant' | 'contractor';
export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export function isRegistrationType(value: string): value is RegistrationType {
  return value === 'consultant' || value === 'contractor';
}

export function isRegistrationStatus(
  value: string,
): value is RegistrationStatus {
  return value === 'pending' || value === 'approved' || value === 'rejected';
}

export const COMMITTEE_MEMBER_OPTIONS = [
  { value: 'dbdc', label: 'DBDC (Main Commission)' },
  { value: 'rdc', label: 'R&DC' },
  { value: 'sc', label: 'SC' },
  { value: 'wc', label: 'WC' },
  { value: 'cabpag', label: 'CaBPAG' },
] as const;

export type AdminCommitteeSlug =
  (typeof COMMITTEE_MEMBER_OPTIONS)[number]['value'];

export function isAdminCommitteeSlug(
  value: string,
): value is AdminCommitteeSlug {
  return COMMITTEE_MEMBER_OPTIONS.some((option) => option.value === value);
}

/**
 * Fixed roles for the admin dropdown. Values match homepage grouping
 * in `groupDbdcMembers` (case-insensitive / substring checks).
 */
export const COMMITTEE_ROLE_OPTIONS = [
  { value: 'Ex-officio', label: 'Ex-officio' },
  { value: 'Chairman', label: 'Chairman' },
  { value: 'Vice-chairman', label: 'Vice-chairman' },
  { value: 'Member', label: 'Member' },
  { value: 'Administrator', label: 'Administrator' },
] as const;

export type CommitteeRoleOption =
  (typeof COMMITTEE_ROLE_OPTIONS)[number]['value'];

export function isCommitteeRoleOption(
  value: string,
): value is CommitteeRoleOption {
  return COMMITTEE_ROLE_OPTIONS.some((option) => option.value === value);
}

/** Normalize legacy free-text roles onto a dropdown value when possible. */
export function matchCommitteeRoleOption(
  role: string | null | undefined,
): CommitteeRoleOption | '' {
  if (!role) return '';
  const normalized = role.trim().toLowerCase();
  if (normalized.includes('administrator')) return 'Administrator';
  if (normalized.includes('ex-officio') || normalized.includes('ex officio')) {
    return 'Ex-officio';
  }
  if (
    normalized === 'chairman' ||
    normalized === 'chairperson' ||
    normalized === 'convenor'
  ) {
    return 'Chairman';
  }
  if (
    normalized === 'vice-chairman' ||
    normalized === 'vice-chairperson' ||
    normalized === 'vice chairman' ||
    normalized.includes('deputy')
  ) {
    return 'Vice-chairman';
  }
  if (normalized === 'member') return 'Member';

  const exact = COMMITTEE_ROLE_OPTIONS.find(
    (option) => option.value.toLowerCase() === normalized,
  );
  return exact?.value ?? '';
}
