/**
 * Hardcoded allowlist for admin magic-link access.
 * Prefer ADMIN_EMAILS env (comma-separated) when set; otherwise use this list.
 */
const DEFAULT_ADMIN_EMAILS = ['maryamk3886@gmail.com'] as const;

export function getAdminAllowlist(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (fromEnv.length > 0) return fromEnv;
  return DEFAULT_ADMIN_EMAILS.map((email) => email.toLowerCase());
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminAllowlist().includes(email.trim().toLowerCase());
}

export const REGISTRATION_BUCKET = 'registration-documents';

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
