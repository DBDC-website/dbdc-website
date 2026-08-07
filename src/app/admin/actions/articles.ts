'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ARTICLES_BUCKET } from '@/constants/admin';
import { nextArticleSortOrder } from '@/lib/admin/articles';
import {
  isPermutation,
  type ReorderResult,
} from '@/lib/admin/reorder';
import { isAutoRomanLabel, toRomanLabel } from '@/lib/admin/romanLabel';
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

function readLocalizedFields(formData: FormData) {
  return {
    labelEn: readText(formData, 'label_en'),
    labelZhHant: readText(formData, 'label_zh_hant'),
    labelZhHans: readText(formData, 'label_zh_hans'),
    titleEn: readText(formData, 'title_en'),
    titleZhHant: readText(formData, 'title_zh_hant'),
    titleZhHans: readText(formData, 'title_zh_hans'),
    author: readText(formData, 'author'),
    date: readText(formData, 'date'),
  };
}

async function uploadArticlePdf(
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
    ? storagePathFromPublicUrl(previousUrl, ARTICLES_BUCKET)
    : null;
  const path = resolveStorageBaseName({
    preferredName,
    uploadedFileName: file.name,
    previousPath,
    fallback: 'article.pdf',
    defaultExtension: '.pdf',
  });

  const { publicUrl } = await uploadReplacingStorageObject(supabase, {
    bucket: ARTICLES_BUCKET,
    file,
    path,
    previousUrl,
    contentType: 'application/pdf',
  });

  return publicUrl;
}

function revalidateArticlePaths() {
  revalidatePath('/', 'layout');
  revalidatePath('/admin/articles');
}

/** Resolve PDF URL: uploaded file wins; otherwise keep existing; empty is allowed. */
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
        pdfUrl: await uploadArticlePdf(
          supabase,
          pdf,
          preferredName,
          existingUrl,
        ),
      };
    } catch (error) {
      console.error('Article PDF upload failed:', error);
      return { error: 'upload' };
    }
  }

  return { pdfUrl: existingUrl };
}

export async function createArticle(formData: FormData) {
  const supabase = await requireAdmin();

  const fields = readLocalizedFields(formData);
  const requestedOrder = parseSortOrder(readText(formData, 'sort_order'));

  if (!fields.titleEn) {
    redirect('/admin/articles/new?error=required');
  }

  const resolved = await resolvePdfUrl(supabase, formData);
  if ('error' in resolved) {
    redirect(`/admin/articles/new?error=${resolved.error}`);
  }

  const sortOrder = requestedOrder ?? (await nextArticleSortOrder(supabase));
  const roman = toRomanLabel(sortOrder);
  const labelEn = fields.labelEn || roman;
  const labelZhHant = fields.labelZhHant || labelEn;
  const labelZhHans = fields.labelZhHans || labelEn;

  const { data, error } = await supabase
    .from('articles')
    .insert({
      label: labelEn,
      label_en: labelEn,
      label_zh_hant: labelZhHant,
      label_zh_hans: labelZhHans,
      title: fields.titleEn,
      title_en: fields.titleEn,
      title_zh_hant: fields.titleZhHant || null,
      title_zh_hans: fields.titleZhHans || null,
      // Column is NOT NULL in the DB — store empty string when omitted.
      author: fields.author,
      date: fields.date,
      pdf_url: resolved.pdfUrl,
      sort_order: sortOrder,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Failed to create article:', error);
    redirect('/admin/articles/new?error=save');
  }

  revalidateArticlePaths();
  redirect(`/admin/articles/${data.id}?saved=1`);
}

export async function updateArticle(formData: FormData) {
  const supabase = await requireAdmin();

  const id = Number(readText(formData, 'id'));
  if (!Number.isFinite(id) || id <= 0) {
    redirect('/admin/articles?error=invalid');
  }

  const fields = readLocalizedFields(formData);
  const requestedOrder = parseSortOrder(readText(formData, 'sort_order'));

  if (!fields.titleEn) {
    redirect(`/admin/articles/${id}?error=required`);
  }

  const resolved = await resolvePdfUrl(supabase, formData);
  if ('error' in resolved) {
    redirect(`/admin/articles/${id}?error=${resolved.error}`);
  }

  const { data: existing, error: existingError } = await supabase
    .from('articles')
    .select('sort_order, label, label_en')
    .eq('id', id)
    .maybeSingle();

  if (existingError || !existing) {
    redirect('/admin/articles?error=invalid');
  }

  const sortOrder = requestedOrder ?? (existing.sort_order as number);
  const fallbackLabel =
    (existing.label_en as string)?.trim() ||
    (existing.label as string)?.trim() ||
    toRomanLabel(sortOrder);
  const labelEn = fields.labelEn || fallbackLabel;
  const labelZhHant = fields.labelZhHant || labelEn;
  const labelZhHans = fields.labelZhHans || labelEn;

  const { error } = await supabase
    .from('articles')
    .update({
      label: labelEn,
      label_en: labelEn,
      label_zh_hant: labelZhHant,
      label_zh_hans: labelZhHans,
      title: fields.titleEn,
      title_en: fields.titleEn,
      title_zh_hant: fields.titleZhHant || null,
      title_zh_hans: fields.titleZhHans || null,
      // Column is NOT NULL in the DB — store empty string when omitted.
      author: fields.author,
      date: fields.date,
      pdf_url: resolved.pdfUrl,
      ...(requestedOrder ? { sort_order: requestedOrder } : {}),
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to update article:', error);
    redirect(`/admin/articles/${id}?error=save`);
  }

  revalidateArticlePaths();
  revalidatePath(`/admin/articles/${id}`);
  redirect(`/admin/articles/${id}?saved=1`);
}

export async function deleteArticle(formData: FormData) {
  const supabase = await requireAdmin();
  const id = Number(readText(formData, 'id'));

  if (!Number.isFinite(id) || id <= 0) {
    redirect('/admin/articles?error=invalid');
  }

  const { error } = await supabase.from('articles').delete().eq('id', id);

  if (error) {
    console.error('Failed to delete article:', error);
    redirect(`/admin/articles/${id}?error=delete`);
  }

  revalidateArticlePaths();
  redirect('/admin/articles?deleted=1');
}

/** Persist a new articles list order (drag-and-drop). */
export async function reorderArticles(
  orderedIds: number[],
): Promise<ReorderResult> {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from('articles')
    .select('id, label, label_en, label_zh_hant, label_zh_hans')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to load articles for reorder:', error);
    return { ok: false, error: 'Could not load articles to reorder.' };
  }

  const expectedIds = (data ?? []).map((row) => row.id as number);
  if (!isPermutation(orderedIds, expectedIds)) {
    return {
      ok: false,
      error: 'Order is out of date. Refresh the page and try again.',
    };
  }

  const currentLabels = new Map(
    (data ?? []).map((row) => [row.id as number, row]),
  );

  const LABEL_COLUMNS = [
    'label',
    'label_en',
    'label_zh_hant',
    'label_zh_hans',
  ] as const;

  try {
    for (let index = 0; index < orderedIds.length; index += 1) {
      const id = orderedIds[index];
      const roman = toRomanLabel(index + 1);
      const existing = currentLabels.get(id);

      // Renumber auto-generated labels only; a label an editor typed is kept.
      const labelUpdates: Record<string, string> = {};
      for (const column of LABEL_COLUMNS) {
        const value = existing?.[column] as string | null | undefined;
        if (isAutoRomanLabel(value)) {
          labelUpdates[column] = roman;
        }
      }

      const { error: updateError } = await supabase
        .from('articles')
        .update({
          sort_order: index + 1,
          ...labelUpdates,
        })
        .eq('id', id);

      if (updateError) {
        throw new Error(updateError.message);
      }
    }
  } catch (reorderError) {
    console.error('Failed to reorder articles:', reorderError);
    return { ok: false, error: 'Could not save the new order.' };
  }

  revalidateArticlePaths();
  return { ok: true };
}
