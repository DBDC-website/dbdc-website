'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ARTICLES_BUCKET } from '@/constants/admin';
import { nextArticleSortOrder } from '@/lib/admin/articles';
import { requireAdmin } from '@/lib/admin/requireAdmin';

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

function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .slice(-120);
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
): Promise<string> {
  if (file.size > MAX_PDF_BYTES) {
    throw new Error('PDF must be 25MB or smaller.');
  }
  if (file.type && file.type !== 'application/pdf') {
    throw new Error('File must be a PDF.');
  }

  const path = `${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(file.name) || 'article.pdf'}`;

  const { error } = await supabase.storage
    .from(ARTICLES_BUCKET)
    .upload(path, file, {
      upsert: false,
      contentType: 'application/pdf',
    });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(ARTICLES_BUCKET).getPublicUrl(path);

  return publicUrl;
}

function revalidateArticlePaths() {
  revalidatePath('/', 'layout');
  revalidatePath('/admin/articles');
}

export async function createArticle(formData: FormData) {
  const supabase = await requireAdmin();

  const fields = readLocalizedFields(formData);
  const pdfUrlInput = readText(formData, 'pdf_url');
  const requestedOrder = parseSortOrder(readText(formData, 'sort_order'));

  if (!fields.titleEn || !fields.labelEn || !fields.date) {
    redirect('/admin/articles/new?error=required');
  }

  let pdfUrl = pdfUrlInput;
  const pdf = formData.get('pdf');

  try {
    if (pdf instanceof File && pdf.size > 0) {
      pdfUrl = await uploadArticlePdf(supabase, pdf);
    }
  } catch (error) {
    console.error('Article PDF upload failed:', error);
    redirect('/admin/articles/new?error=upload');
  }

  if (!pdfUrl) {
    redirect('/admin/articles/new?error=pdf');
  }

  const sortOrder = requestedOrder ?? (await nextArticleSortOrder(supabase));

  const { data, error } = await supabase
    .from('articles')
    .insert({
      label: fields.labelEn,
      label_en: fields.labelEn,
      label_zh_hant: fields.labelZhHant || null,
      label_zh_hans: fields.labelZhHans || null,
      title: fields.titleEn,
      title_en: fields.titleEn,
      title_zh_hant: fields.titleZhHant || null,
      title_zh_hans: fields.titleZhHans || null,
      author: fields.author || null,
      date: fields.date,
      pdf_url: pdfUrl,
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
  const pdfUrlInput = readText(formData, 'pdf_url');
  const requestedOrder = parseSortOrder(readText(formData, 'sort_order'));

  if (!fields.titleEn || !fields.labelEn || !fields.date) {
    redirect(`/admin/articles/${id}?error=required`);
  }

  let pdfUrl = pdfUrlInput;
  const pdf = formData.get('pdf');

  try {
    if (pdf instanceof File && pdf.size > 0) {
      pdfUrl = await uploadArticlePdf(supabase, pdf);
    }
  } catch (error) {
    console.error('Article PDF upload failed:', error);
    redirect(`/admin/articles/${id}?error=upload`);
  }

  if (!pdfUrl) {
    redirect(`/admin/articles/${id}?error=pdf`);
  }

  const { error } = await supabase
    .from('articles')
    .update({
      label: fields.labelEn,
      label_en: fields.labelEn,
      label_zh_hant: fields.labelZhHant || null,
      label_zh_hans: fields.labelZhHans || null,
      title: fields.titleEn,
      title_en: fields.titleEn,
      title_zh_hant: fields.titleZhHant || null,
      title_zh_hans: fields.titleZhHans || null,
      author: fields.author || null,
      date: fields.date,
      pdf_url: pdfUrl,
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
