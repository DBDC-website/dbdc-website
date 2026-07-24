'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  isRegistrationStatus,
  isRegistrationType,
  type RegistrationStatus,
  type RegistrationType,
} from '@/constants/admin';
import { requireAdmin } from '@/lib/admin/requireAdmin';

function tableFor(type: RegistrationType) {
  return type === 'consultant'
    ? 'consultant_registrations'
    : 'contractor_registrations';
}

export async function updateRegistrationStatus(
  typeRaw: string,
  idRaw: string,
  statusRaw: string,
) {
  if (!isRegistrationType(typeRaw) || !isRegistrationStatus(statusRaw)) {
    redirect('/admin/registrations?error=invalid');
  }

  const id = Number(idRaw);
  if (!Number.isFinite(id) || id <= 0) {
    redirect('/admin/registrations?error=invalid');
  }

  const type = typeRaw as RegistrationType;
  const status = statusRaw as RegistrationStatus;
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from(tableFor(type))
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Failed to update registration status:', error);
    redirect(`/admin/registrations/${type}/${id}?error=update`);
  }

  revalidatePath('/admin/registrations');
  revalidatePath(`/admin/registrations/${type}/${id}`);
  redirect(`/admin/registrations/${type}/${id}?updated=1`);
}
