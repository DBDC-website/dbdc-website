'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CABPAG_NEWSLETTERS_BUCKET } from '@/constants/admin';
import { nextCabpagNewsletterSortOrder } from '@/lib/admin/newsletters';
import {
  isPermutation,
  type ReorderResult,
  writeSequentialSortOrders,
} from '@/lib/admin/reorder';
import { requireAdmin } from '@/lib/admin/requireAdmin';
import {
  resolveStorageBaseName,
  storagePathFromPublicUrl,
  uploadReplacingStorageObject,
} from '@/lib/admin/storageUpload';

const MAX_PDF_BYTES = 25 * 1024 * 1024;

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function parseIntInRange(
  raw: string,
  min: number,
  max: number,
): number | null {
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  const truncated = Math.trunc(value);
  if (truncated < min || truncated > max) return null;
  return truncated;
}

function parseSortOrder(raw: string): number | null {
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.trunc(value);
}

function isPdfFile(file: File): boolean {
  if (file.type === 'application/pdf') return true;
  return file.name.toLowerCase().endsWith('.pdf');
}

function revalidateNewsletterPaths() {
  revalidatePath('/', 'layout');
  revalidatePath('/admin/newsletters');
}

async function uploadNewsletterPdf(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  file: File,
  preferredName: string,
  previousUrl: string,
): Promise<string> {
  if (file.size > MAX_PDF_BYTES) {
    throw new Error('PDF must be 25MB or smaller.');
  }
  if (!isPdfFile(file)) {
    throw new Error('File must be a PDF.');
  }

  const previousPath = previousUrl
    ? storagePathFromPublicUrl(previousUrl, CABPAG_NEWSLETTERS_BUCKET)
    : null;
  const path = resolveStorageBaseName({
    preferredName,
    uploadedFileName: file.name,
    previousPath,
    fallback: 'newsletter.pdf',
    defaultExtension: '.pdf',
  });

  const { publicUrl } = await uploadReplacingStorageObject(supabase, {
    bucket: CABPAG_NEWSLETTERS_BUCKET,
    file,
    path,
    previousUrl,
    contentType: 'application/pdf',
  });

  return publicUrl;
}

async function resolvePdfUrl(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  formData: FormData,
): Promise<{ pdfUrl: string } | { error: 'upload' }> {
  const existingUrl = readText(formData, 'existing_pdf_url');
  const pdf = formData.get('pdf');

  if (pdf instanceof File && pdf.size > 0) {
    try {
      const preferredName = readText(formData, 'pdf_filename');
      return {
        pdfUrl: await uploadNewsletterPdf(
          supabase,
          pdf,
          preferredName,
          existingUrl,
        ),
      };
    } catch (error) {
      console.error('CaBPAG newsletter PDF upload failed:', error);
      return { error: 'upload' };
    }
  }

  return { pdfUrl: existingUrl };
}

function readNewsletterFields(formData: FormData) {
  return {
    titleEn: readText(formData, 'title_en'),
    titleZhHant: readText(formData, 'title_zh_hant'),
    titleZhHans: readText(formData, 'title_zh_hans'),
    publishedMonth: parseIntInRange(readText(formData, 'published_month'), 1, 12),
    publishedYear: parseIntInRange(
      readText(formData, 'published_year'),
      1900,
      2100,
    ),
    externalUrl: readText(formData, 'external_url'),
    sortOrder: parseSortOrder(readText(formData, 'sort_order')),
    active: readText(formData, 'active') === 'on',
  };
}

export async function createCabpagNewsletter(formData: FormData) {
  const supabase = await requireAdmin();
  const fields = readNewsletterFields(formData);

  if (!fields.titleEn || fields.publishedMonth == null || fields.publishedYear == null) {
    redirect('/admin/newsletters/new?error=required');
  }

  const resolved = await resolvePdfUrl(supabase, formData);
  if ('error' in resolved) {
    redirect(`/admin/newsletters/new?error=${resolved.error}`);
  }

  if (!resolved.pdfUrl && !fields.externalUrl) {
    redirect('/admin/newsletters/new?error=source');
  }

  const sortOrder =
    fields.sortOrder ?? (await nextCabpagNewsletterSortOrder(supabase));

  const { error } = await supabase.from('cabpag_newsletters').insert({
    title: fields.titleEn,
    title_zh_hant: fields.titleZhHant || null,
    title_zh_hans: fields.titleZhHans || null,
    published_month: fields.publishedMonth,
    published_year: fields.publishedYear,
    pdf_url: resolved.pdfUrl || null,
    external_url: fields.externalUrl || null,
    sort_order: sortOrder,
    active: fields.active,
  });

  if (error) {
    console.error('Failed to create CaBPAG newsletter:', error);
    redirect('/admin/newsletters/new?error=save');
  }

  revalidateNewsletterPaths();
  redirect('/admin/newsletters?created=1');
}

export async function updateCabpagNewsletter(formData: FormData) {
  const supabase = await requireAdmin();
  const id = Number(readText(formData, 'id'));
  if (!Number.isFinite(id) || id <= 0) {
    redirect('/admin/newsletters?error=invalid');
  }

  const fields = readNewsletterFields(formData);
  if (!fields.titleEn || fields.publishedMonth == null || fields.publishedYear == null) {
    redirect(`/admin/newsletters/${id}?error=required`);
  }

  const resolved = await resolvePdfUrl(supabase, formData);
  if ('error' in resolved) {
    redirect(`/admin/newsletters/${id}?error=${resolved.error}`);
  }

  if (!resolved.pdfUrl && !fields.externalUrl) {
    redirect(`/admin/newsletters/${id}?error=source`);
  }

  const payload: Record<string, unknown> = {
    title: fields.titleEn,
    title_zh_hant: fields.titleZhHant || null,
    title_zh_hans: fields.titleZhHans || null,
    published_month: fields.publishedMonth,
    published_year: fields.publishedYear,
    pdf_url: resolved.pdfUrl || null,
    external_url: fields.externalUrl || null,
    active: fields.active,
    updated_at: new Date().toISOString(),
  };

  if (fields.sortOrder != null) {
    payload.sort_order = fields.sortOrder;
  }

  const { error } = await supabase
    .from('cabpag_newsletters')
    .update(payload)
    .eq('id', id);

  if (error) {
    console.error('Failed to update CaBPAG newsletter:', error);
    redirect(`/admin/newsletters/${id}?error=save`);
  }

  revalidateNewsletterPaths();
  redirect(`/admin/newsletters/${id}?saved=1`);
}

export async function deleteCabpagNewsletter(formData: FormData) {
  const supabase = await requireAdmin();
  const id = Number(readText(formData, 'id'));
  if (!Number.isFinite(id) || id <= 0) {
    redirect('/admin/newsletters?error=invalid');
  }

  const { error } = await supabase
    .from('cabpag_newsletters')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete CaBPAG newsletter:', error);
    redirect(`/admin/newsletters/${id}?error=delete`);
  }

  revalidateNewsletterPaths();
  redirect('/admin/newsletters?deleted=1');
}

/** Persist a new newsletters list order (drag-and-drop). */
export async function reorderCabpagNewsletters(
  orderedIds: number[],
): Promise<ReorderResult> {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from('cabpag_newsletters')
    .select('id')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to load newsletters for reorder:', error);
    return { ok: false, error: 'Could not load newsletters to reorder.' };
  }

  const expectedIds = (data ?? []).map((row) => row.id as number);
  if (!isPermutation(orderedIds, expectedIds)) {
    return {
      ok: false,
      error: 'Order is out of date. Refresh the page and try again.',
    };
  }

  try {
    await writeSequentialSortOrders(supabase, 'cabpag_newsletters', orderedIds);
  } catch (reorderError) {
    console.error('Failed to reorder newsletters:', reorderError);
    return { ok: false, error: 'Could not save the new order.' };
  }

  revalidateNewsletterPaths();
  return { ok: true };
}
