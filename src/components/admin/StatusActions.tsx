'use client';

import { useTransition } from 'react';
import { updateRegistrationStatus } from '@/app/admin/actions/updateStatus';
import Button from '@/components/ui/Button';
import type { RegistrationType } from '@/constants/admin';

type StatusActionsProps = {
  type: RegistrationType;
  id: number;
};

export default function StatusActions({ type, id }: StatusActionsProps) {
  const [isPending, startTransition] = useTransition();

  const onUpdate = (status: 'approved' | 'rejected') => {
    startTransition(async () => {
      await updateRegistrationStatus(type, String(id), status);
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        variant="primary"
        disabled={isPending}
        onClick={() => onUpdate('approved')}
      >
        {isPending ? 'Updating…' : 'Approve'}
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => onUpdate('rejected')}
        className="border-red-300 text-red-700 hover:border-red-400 hover:bg-red-50"
      >
        Reject
      </Button>
    </div>
  );
}
