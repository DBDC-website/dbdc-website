import type { RegistrationStatus } from '@/constants/admin';
import { cn } from '@/lib/cn';

const statusStyles: Record<RegistrationStatus, string> = {
  pending: 'bg-gold-100 text-gold-800',
  approved: 'bg-sage-100 text-sage-800',
  rejected: 'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }: { status: RegistrationStatus }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        statusStyles[status],
      )}
    >
      {status}
    </span>
  );
}
