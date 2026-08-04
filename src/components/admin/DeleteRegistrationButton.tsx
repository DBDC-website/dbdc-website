'use client';

import { deleteRegistration } from '@/app/admin/actions/registrations';
import Button from '@/components/ui/Button';
import type { RegistrationType } from '@/constants/admin';

type DeleteRegistrationButtonProps = {
  type: RegistrationType;
  id: number;
  companyName: string;
};

export default function DeleteRegistrationButton({
  type,
  id,
  companyName,
}: DeleteRegistrationButtonProps) {
  return (
    <form
      action={deleteRegistration}
      onSubmit={(event) => {
        const ok = window.confirm(
          `Delete registration for “${companyName}”? This removes the record and uploaded files permanently.`,
        );
        if (!ok) event.preventDefault();
      }}
    >
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="border-red-300 text-red-800 hover:bg-red-50"
      >
        Delete permanently
      </Button>
    </form>
  );
}
