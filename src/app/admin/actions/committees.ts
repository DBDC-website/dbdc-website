'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  isAdminCommitteeSlug,
  isCommitteeRoleOption,
  type AdminCommitteeSlug,
  type CommitteeRoleOption,
} from '@/constants/admin';
import {
  compactAfterRemoval,
  moveToSortOrder,
  resolveCreateSortOrder,
} from '@/lib/admin/committeeOrder';
import { requireAdmin } from '@/lib/admin/requireAdmin';

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

/** Empty / invalid → null (auto). Explicit numbers stay as-is. */
function parseOptionalSortOrder(raw: string): number | null {
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.trunc(value);
}

function revalidateCommitteePaths() {
  revalidatePath('/', 'layout');
  revalidatePath('/admin/committees');
}

export async function createCommitteeMember(formData: FormData) {
  const supabase = await requireAdmin();

  const name = readText(formData, 'name');
  const roleRaw = readText(formData, 'role');
  const slugRaw = readText(formData, 'committee_slug');
  const requestedOrder = parseOptionalSortOrder(readText(formData, 'sort_order'));
  const active = formData.get('active') === 'on';

  if (!name || !isAdminCommitteeSlug(slugRaw) || !isCommitteeRoleOption(roleRaw)) {
    redirect('/admin/committees/new?error=invalid');
  }

  const committeeSlug = slugRaw as AdminCommitteeSlug;
  const role = roleRaw as CommitteeRoleOption;

  let sortOrder: number;
  try {
    sortOrder = await resolveCreateSortOrder(
      supabase,
      committeeSlug,
      role,
      requestedOrder,
    );
  } catch (error) {
    console.error('Failed to place committee member:', error);
    redirect('/admin/committees/new?error=save');
  }

  const { data, error } = await supabase
    .from('committee_members')
    .insert({
      name,
      role,
      committee_slug: committeeSlug,
      sort_order: sortOrder,
      active,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Failed to create committee member:', error);
    redirect('/admin/committees/new?error=save');
  }

  revalidateCommitteePaths();
  redirect(`/admin/committees/${data.id}?saved=1`);
}

export async function updateCommitteeMember(formData: FormData) {
  const supabase = await requireAdmin();

  const id = Number(readText(formData, 'id'));
  const name = readText(formData, 'name');
  const roleRaw = readText(formData, 'role');
  const slugRaw = readText(formData, 'committee_slug');
  const requestedOrder = parseOptionalSortOrder(readText(formData, 'sort_order'));
  const active = formData.get('active') === 'on';

  if (
    !Number.isFinite(id) ||
    id <= 0 ||
    !name ||
    !isAdminCommitteeSlug(slugRaw) ||
    !isCommitteeRoleOption(roleRaw)
  ) {
    redirect('/admin/committees?error=invalid');
  }

  const { data: existing, error: existingError } = await supabase
    .from('committee_members')
    .select('id, committee_slug, sort_order')
    .eq('id', id)
    .maybeSingle();

  if (existingError || !existing) {
    redirect('/admin/committees?error=invalid');
  }

  const committeeSlug = slugRaw as AdminCommitteeSlug;
  const previousSlug = existing.committee_slug as AdminCommitteeSlug;
  const targetOrder = requestedOrder ?? existing.sort_order;

  let sortOrder: number;
  try {
    sortOrder = await moveToSortOrder(
      supabase,
      committeeSlug,
      id,
      targetOrder,
      previousSlug,
    );
  } catch (error) {
    console.error('Failed to reorder committee member:', error);
    redirect(`/admin/committees/${id}?error=save`);
  }

  const { error } = await supabase
    .from('committee_members')
    .update({
      name,
      role: roleRaw,
      committee_slug: committeeSlug,
      sort_order: sortOrder,
      active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to update committee member:', error);
    redirect(`/admin/committees/${id}?error=save`);
  }

  revalidateCommitteePaths();
  revalidatePath(`/admin/committees/${id}`);
  redirect(`/admin/committees/${id}?saved=1`);
}

export async function deleteCommitteeMember(formData: FormData) {
  const supabase = await requireAdmin();
  const id = Number(readText(formData, 'id'));

  if (!Number.isFinite(id) || id <= 0) {
    redirect('/admin/committees?error=invalid');
  }

  const { data: existing, error: existingError } = await supabase
    .from('committee_members')
    .select('id, committee_slug')
    .eq('id', id)
    .maybeSingle();

  if (existingError || !existing) {
    redirect('/admin/committees?error=invalid');
  }

  const committeeSlug = existing.committee_slug as AdminCommitteeSlug;

  const { error } = await supabase
    .from('committee_members')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete committee member:', error);
    redirect(`/admin/committees/${id}?error=delete`);
  }

  try {
    await compactAfterRemoval(supabase, committeeSlug, id);
  } catch (compactError) {
    console.error('Failed to compact sort orders after delete:', compactError);
  }

  revalidateCommitteePaths();
  redirect('/admin/committees?deleted=1');
}
