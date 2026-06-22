/**
 * Minimal className joiner. Filters out falsy values so we can write
 * conditional classes without pulling in an extra dependency.
 *
 * Example: cn('p-4', isActive && 'bg-brand-700', undefined) => 'p-4 bg-brand-700'
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
