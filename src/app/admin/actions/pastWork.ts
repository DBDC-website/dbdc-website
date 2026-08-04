'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  isPastWorkAdminSlug,
  PAST_WORK_BUCKET,
  type PastWorkAdminSlug,
} from '@/constants/admin';
import { requireAdmin } from '@/lib/admin/requireAdmin';
import {
  resolveStorageBaseName,
  storagePathFromPublicUrl,
  uploadReplacingStorageObject,
} from '@/lib/admin/storageUpload';
import { locales } from '@/constants/i18n';
import type { SupabaseClient } from '@supabase/supabase-js';

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function parseYear(raw: string): number | null {
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  const year = Math.trunc(value);
  if (year < 1900 || year > 2100) return null;
  return year;
}

function parseId(raw: string): number | null {
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.trunc(value);
}

/** Non-negative insert cursor: 0 = before first item. */
function parseAfterSort(raw: string): number {
  if (!raw) return 0;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.trunc(value);
}

function revalidatePastWork(committeeSlug?: string) {
  revalidatePath('/admin/past-work');
  revalidatePath('/', 'layout');
  if (committeeSlug) {
    for (const locale of locales) {
      revalidatePath(`/${locale}/committees/${committeeSlug}`);
    }
  }
}

function isAllowedFile(file: File): boolean {
  if (ALLOWED_TYPES.has(file.type)) return true;
  const name = file.name.toLowerCase();
  return (
    name.endsWith('.pdf') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.png') ||
    name.endsWith('.webp')
  );
}

async function uploadPastWorkFile(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  file: File,
  committeeSlug: string,
  year: number,
  previousUrl: string,
): Promise<string> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('File must be 25MB or smaller.');
  }
  if (!isAllowedFile(file)) {
    throw new Error('File must be a PDF or image (JPG, PNG, WebP).');
  }

  const previousPath = previousUrl
    ? storagePathFromPublicUrl(previousUrl, PAST_WORK_BUCKET)
    : null;
  const baseName = resolveStorageBaseName({
    preferredName: '',
    uploadedFileName: file.name,
    previousPath,
    fallback: 'attachment',
  });
  const path = `${committeeSlug}/${year}/${baseName}`;

  const { publicUrl } = await uploadReplacingStorageObject(supabase, {
    bucket: PAST_WORK_BUCKET,
    file,
    path,
    previousUrl,
    contentType: file.type || undefined,
  });

  return publicUrl;
}

function splitBulletLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•\-\*\d.)]+/, '').trim())
    .filter(Boolean);
}

/** Shift every item with sort_order > afterSort by `delta`. */
async function shiftItemsAfter(
  supabase: SupabaseClient,
  yearId: number,
  afterSort: number,
  delta: number,
) {
  if (delta === 0) return;

  const { data, error } = await supabase
    .from('committee_past_work_items')
    .select('id, sort_order')
    .eq('year_id', yearId)
    .gt('sort_order', afterSort)
    .order('sort_order', { ascending: delta > 0 ? false : true });

  if (error) throw new Error(error.message);

  const now = new Date().toISOString();
  for (const row of data ?? []) {
    const { error: updateError } = await supabase
      .from('committee_past_work_items')
      .update({
        sort_order: (row.sort_order as number) + delta,
        updated_at: now,
      })
      .eq('id', row.id);

    if (updateError) throw new Error(updateError.message);
  }
}

async function compactYearItems(supabase: SupabaseClient, yearId: number) {
  const { data, error } = await supabase
    .from('committee_past_work_items')
    .select('id, sort_order')
    .eq('year_id', yearId)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) throw new Error(error.message);

  const now = new Date().toISOString();
  let index = 1;
  for (const row of data ?? []) {
    if ((row.sort_order as number) !== index) {
      const { error: updateError } = await supabase
        .from('committee_past_work_items')
        .update({ sort_order: index, updated_at: now })
        .eq('id', row.id);
      if (updateError) throw new Error(updateError.message);
    }
    index += 1;
  }
}

export async function createPastWorkYear(formData: FormData) {
  const supabase = await requireAdmin();
  const slugRaw = readText(formData, 'committee_slug');
  const year = parseYear(readText(formData, 'year'));

  if (!isPastWorkAdminSlug(slugRaw) || year == null) {
    redirect('/admin/past-work/new?error=invalid');
  }

  const committeeSlug = slugRaw as PastWorkAdminSlug;

  const { data, error } = await supabase
    .from('committee_past_work_years')
    .insert({
      committee_slug: committeeSlug,
      year,
      sort_order: year,
      allows_links: true,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Failed to create past work year:', error);
    const code = error?.code === '23505' ? 'duplicate' : 'save';
    redirect(`/admin/past-work/new?error=${code}`);
  }

  revalidatePastWork(committeeSlug);
  redirect(`/admin/past-work/${data.id}?saved=1`);
}

export async function updatePastWorkYear(formData: FormData) {
  const supabase = await requireAdmin();
  const id = parseId(readText(formData, 'id'));
  const slugRaw = readText(formData, 'committee_slug');
  const year = parseYear(readText(formData, 'year'));

  if (id == null || !isPastWorkAdminSlug(slugRaw) || year == null) {
    redirect('/admin/past-work?error=invalid');
  }

  const committeeSlug = slugRaw as PastWorkAdminSlug;

  const { error } = await supabase
    .from('committee_past_work_years')
    .update({
      committee_slug: committeeSlug,
      year,
      sort_order: year,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to update past work year:', error);
    const code = error.code === '23505' ? 'duplicate' : 'save';
    redirect(`/admin/past-work/${id}?error=${code}`);
  }

  revalidatePastWork(committeeSlug);
  redirect(`/admin/past-work/${id}?saved=1`);
}

export async function deletePastWorkYear(formData: FormData) {
  const supabase = await requireAdmin();
  const id = parseId(readText(formData, 'id'));
  if (id == null) {
    redirect('/admin/past-work?error=invalid');
  }

  const { data: existing } = await supabase
    .from('committee_past_work_years')
    .select('committee_slug')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabase
    .from('committee_past_work_years')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete past work year:', error);
    redirect(`/admin/past-work/${id}?error=delete`);
  }

  revalidatePastWork(existing?.committee_slug as string | undefined);
  redirect('/admin/past-work?deleted=1');
}

/** Add one linked (or optionally unlinked) bullet after `after_sort_order`. */
export async function createPastWorkItem(formData: FormData) {
  const supabase = await requireAdmin();
  const yearId = parseId(readText(formData, 'year_id'));
  const textEn = readText(formData, 'text_en');
  const textZhHant = readText(formData, 'text_zh_hant');
  const textZhHans = readText(formData, 'text_zh_hans');
  const hasLink = formData.get('has_link') === 'on';
  const linkUrl = hasLink ? readText(formData, 'link_url') : '';
  const afterSort = parseAfterSort(readText(formData, 'after_sort_order'));

  if (yearId == null || !textEn) {
    redirect(
      yearId
        ? `/admin/past-work/${yearId}?error=item_required`
        : '/admin/past-work?error=invalid',
    );
  }

  const { data: yearRow, error: yearError } = await supabase
    .from('committee_past_work_years')
    .select('id, committee_slug, year')
    .eq('id', yearId)
    .maybeSingle();

  if (yearError || !yearRow) {
    redirect('/admin/past-work?error=invalid');
  }

  let fileUrl: string | null = null;
  const file = formData.get('file');
  if (hasLink && file instanceof File && file.size > 0) {
    try {
      fileUrl = await uploadPastWorkFile(
        supabase,
        file,
        yearRow.committee_slug as string,
        yearRow.year as number,
        '',
      );
    } catch (error) {
      console.error('Past work file upload failed:', error);
      redirect(`/admin/past-work/${yearId}?error=upload`);
    }
  }

  try {
    await shiftItemsAfter(supabase, yearId, afterSort, 1);
  } catch (error) {
    console.error('Failed to shift past work items:', error);
    redirect(`/admin/past-work/${yearId}?error=save`);
  }

  const { error } = await supabase.from('committee_past_work_items').insert({
    year_id: yearId,
    text: textEn,
    text_en: textEn,
    text_zh_hant: textZhHant || null,
    text_zh_hans: textZhHans || null,
    link_url: hasLink && linkUrl ? linkUrl : null,
    file_url: hasLink ? fileUrl : null,
    sort_order: afterSort + 1,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Failed to create past work item:', error);
    redirect(`/admin/past-work/${yearId}?error=save`);
  }

  revalidatePastWork(yearRow.committee_slug as string);
  redirect(`/admin/past-work/${yearId}?saved=item`);
}

export async function updatePastWorkItem(formData: FormData) {
  const supabase = await requireAdmin();
  const id = parseId(readText(formData, 'id'));
  const yearId = parseId(readText(formData, 'year_id'));
  const textEn = readText(formData, 'text_en');
  const textZhHant = readText(formData, 'text_zh_hant');
  const textZhHans = readText(formData, 'text_zh_hans');
  const hasLink = formData.get('has_link') === 'on';
  const linkUrl = hasLink ? readText(formData, 'link_url') : '';
  const clearFile = formData.get('clear_file') === 'on';
  const existingFileUrl = readText(formData, 'existing_file_url');

  if (id == null || yearId == null || !textEn) {
    redirect(
      yearId
        ? `/admin/past-work/${yearId}?error=item_required`
        : '/admin/past-work?error=invalid',
    );
  }

  const { data: yearRow, error: yearError } = await supabase
    .from('committee_past_work_years')
    .select('id, committee_slug, year')
    .eq('id', yearId)
    .maybeSingle();

  if (yearError || !yearRow) {
    redirect('/admin/past-work?error=invalid');
  }

  let fileUrl: string | null = null;
  if (hasLink) {
    fileUrl = clearFile ? null : existingFileUrl || null;
    const file = formData.get('file');
    if (file instanceof File && file.size > 0) {
      try {
        fileUrl = await uploadPastWorkFile(
          supabase,
          file,
          yearRow.committee_slug as string,
          yearRow.year as number,
          existingFileUrl,
        );
      } catch (error) {
        console.error('Past work file upload failed:', error);
        redirect(`/admin/past-work/${yearId}?error=upload`);
      }
    }
  }

  const { error } = await supabase
    .from('committee_past_work_items')
    .update({
      text: textEn,
      text_en: textEn,
      text_zh_hant: textZhHant || null,
      text_zh_hans: textZhHans || null,
      link_url: hasLink && linkUrl ? linkUrl : null,
      file_url: hasLink ? fileUrl : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('year_id', yearId);

  if (error) {
    console.error('Failed to update past work item:', error);
    redirect(`/admin/past-work/${yearId}?error=save`);
  }

  revalidatePastWork(yearRow.committee_slug as string);
  redirect(`/admin/past-work/${yearId}?saved=item`);
}

/**
 * Insert a new bulk (no-link) block after `after_sort_order`,
 * or replace an existing bulk group when `replace_ids` is set.
 */
export async function savePastWorkBulkText(formData: FormData) {
  const supabase = await requireAdmin();
  const yearId = parseId(readText(formData, 'year_id'));
  const textEn = readText(formData, 'bulk_text_en');
  const textZhHantRaw = readText(formData, 'bulk_text_zh_hant');
  const textZhHansRaw = readText(formData, 'bulk_text_zh_hans');
  const afterSort = parseAfterSort(readText(formData, 'after_sort_order'));
  const replaceIds = readText(formData, 'replace_ids')
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (yearId == null) {
    redirect('/admin/past-work?error=invalid');
  }

  const enLines = splitBulletLines(textEn);
  if (enLines.length === 0) {
    redirect(`/admin/past-work/${yearId}?error=item_required`);
  }

  const zhHantLines = splitBulletLines(textZhHantRaw);
  const zhHansLines = splitBulletLines(textZhHansRaw);

  const { data: yearRow, error: yearError } = await supabase
    .from('committee_past_work_years')
    .select('id, committee_slug')
    .eq('id', yearId)
    .maybeSingle();

  if (yearError || !yearRow) {
    redirect('/admin/past-work?error=invalid');
  }

  try {
    let insertAt = afterSort + 1;

    if (replaceIds.length > 0) {
      const { data: existing, error: existingError } = await supabase
        .from('committee_past_work_items')
        .select('id, sort_order')
        .eq('year_id', yearId)
        .in('id', replaceIds)
        .order('sort_order', { ascending: true });

      if (existingError) throw new Error(existingError.message);

      const oldCount = existing?.length ?? 0;
      insertAt =
        oldCount > 0
          ? Math.min(...(existing ?? []).map((row) => row.sort_order as number))
          : afterSort + 1;

      const { error: deleteError } = await supabase
        .from('committee_past_work_items')
        .delete()
        .eq('year_id', yearId)
        .in('id', replaceIds);

      if (deleteError) throw new Error(deleteError.message);

      await compactYearItems(supabase, yearId);

      const delta = enLines.length - oldCount;
      if (delta !== 0) {
        await shiftItemsAfter(supabase, yearId, insertAt - 1, delta);
      }
    } else {
      await shiftItemsAfter(supabase, yearId, afterSort, enLines.length);
    }

    const now = new Date().toISOString();
    const rows = enLines.map((line, index) => ({
      year_id: yearId,
      text: line,
      text_en: line,
      text_zh_hant: zhHantLines[index] || null,
      text_zh_hans: zhHansLines[index] || null,
      link_url: null,
      file_url: null,
      sort_order: insertAt + index,
      updated_at: now,
    }));

    const { error } = await supabase.from('committee_past_work_items').insert(rows);
    if (error) throw new Error(error.message);

    await compactYearItems(supabase, yearId);
  } catch (error) {
    console.error('Failed to save past work bulk text:', error);
    redirect(`/admin/past-work/${yearId}?error=save`);
  }

  revalidatePastWork(yearRow.committee_slug as string);
  redirect(`/admin/past-work/${yearId}?saved=item`);
}

export async function deletePastWorkItem(formData: FormData) {
  const supabase = await requireAdmin();
  const id = parseId(readText(formData, 'id'));
  const yearId = parseId(readText(formData, 'year_id'));

  if (id == null || yearId == null) {
    redirect('/admin/past-work?error=invalid');
  }

  const { data: yearRow } = await supabase
    .from('committee_past_work_years')
    .select('committee_slug')
    .eq('id', yearId)
    .maybeSingle();

  const { error } = await supabase
    .from('committee_past_work_items')
    .delete()
    .eq('id', id)
    .eq('year_id', yearId);

  if (error) {
    console.error('Failed to delete past work item:', error);
    redirect(`/admin/past-work/${yearId}?error=delete`);
  }

  try {
    await compactYearItems(supabase, yearId);
  } catch (compactError) {
    console.error('Failed to compact after delete:', compactError);
  }

  revalidatePastWork(yearRow?.committee_slug as string | undefined);
  redirect(`/admin/past-work/${yearId}?saved=deleted_item`);
}

export async function deletePastWorkBulkGroup(formData: FormData) {
  const supabase = await requireAdmin();
  const yearId = parseId(readText(formData, 'year_id'));
  const replaceIds = readText(formData, 'replace_ids')
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (yearId == null || replaceIds.length === 0) {
    redirect('/admin/past-work?error=invalid');
  }

  const { data: yearRow } = await supabase
    .from('committee_past_work_years')
    .select('committee_slug')
    .eq('id', yearId)
    .maybeSingle();

  const { error } = await supabase
    .from('committee_past_work_items')
    .delete()
    .eq('year_id', yearId)
    .in('id', replaceIds);

  if (error) {
    console.error('Failed to delete past work bulk group:', error);
    redirect(`/admin/past-work/${yearId}?error=delete`);
  }

  try {
    await compactYearItems(supabase, yearId);
  } catch (compactError) {
    console.error('Failed to compact after bulk delete:', compactError);
  }

  revalidatePastWork(yearRow?.committee_slug as string | undefined);
  redirect(`/admin/past-work/${yearId}?saved=deleted_item`);
}
