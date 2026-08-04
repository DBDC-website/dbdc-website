'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  REGISTRATION_BUCKET,
  isRegistrationType,
  type RegistrationType,
} from '@/constants/admin';
import { requireAdmin } from '@/lib/admin/requireAdmin';

function tableFor(type: RegistrationType) {
  return type === 'consultant'
    ? 'consultant_registrations'
    : 'contractor_registrations';
}

function contactsTableFor(type: RegistrationType) {
  return type === 'consultant' ? 'consultant_contacts' : 'contractor_contacts';
}

function toObjectPath(storedPath: string): string {
  const prefix = `${REGISTRATION_BUCKET}/`;
  return storedPath.startsWith(prefix)
    ? storedPath.slice(prefix.length)
    : storedPath;
}

function collectObjectPaths(paths: Array<string | null | undefined>): string[] {
  const unique = new Set<string>();
  for (const path of paths) {
    if (!path?.trim()) continue;
    unique.add(toObjectPath(path.trim()));
  }
  return [...unique];
}

export async function deleteRegistration(formData: FormData) {
  const typeRaw = String(formData.get('type') ?? '');
  const idRaw = String(formData.get('id') ?? '');

  if (!isRegistrationType(typeRaw)) {
    redirect('/admin/registrations?error=invalid');
  }

  const id = Number(idRaw);
  if (!Number.isFinite(id) || id <= 0) {
    redirect('/admin/registrations?error=invalid');
  }

  const type = typeRaw as RegistrationType;
  const supabase = await requireAdmin();
  const table = tableFor(type);

  const [{ data: registration, error: fetchError }, { data: contacts }] =
    await Promise.all([
      supabase
        .from(table)
        .select('id, signature_url, document_urls')
        .eq('id', id)
        .maybeSingle(),
      supabase
        .from(contactsTableFor(type))
        .select('signature_url')
        .eq('registration_id', id),
    ]);

  if (fetchError) {
    console.error('Failed to load registration for delete:', fetchError);
    redirect(`/admin/registrations/${type}/${id}?error=delete`);
  }

  if (!registration) {
    redirect('/admin/registrations?error=missing');
  }

  const documentUrls = Array.isArray(registration.document_urls)
    ? registration.document_urls.filter(
        (item): item is string => typeof item === 'string',
      )
    : [];

  const objectPaths = collectObjectPaths([
    registration.signature_url,
    ...documentUrls,
    ...(contacts ?? []).map((contact) => contact.signature_url),
  ]);

  if (objectPaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(REGISTRATION_BUCKET)
      .remove(objectPaths);

    if (storageError) {
      console.error('Failed to remove registration files:', storageError);
      // Continue with DB delete so the admin can still clear the record.
    }
  }

  const { error: deleteError } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Failed to delete registration:', deleteError);
    redirect(`/admin/registrations/${type}/${id}?error=delete`);
  }

  revalidatePath('/admin/registrations');
  redirect('/admin/registrations?deleted=1');
}
