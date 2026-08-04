'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PROJECT_IMAGES_BUCKET } from '@/constants/admin';
import {
  isPermutation,
  writeSequentialSortOrders,
  type ReorderResult,
} from '@/lib/admin/reorder';
import { requireAdmin } from '@/lib/admin/requireAdmin';
import {
  removeStorageObject,
  resolveStorageBaseName,
  storagePathFromPublicUrl,
  uploadReplacingStorageObject,
} from '@/lib/admin/storageUpload';

async function nextProjectSortOrder(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
): Promise<number> {
  const { data, error } = await supabase
    .from('projects')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return 1;
  return (data.sort_order as number) + 1;
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return slug || 'project';
}

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function parseYear(raw: string): number | null {
  if (!raw) return null;
  const year = Number(raw);
  if (!Number.isInteger(year) || year < 1800 || year > 2100) return null;
  return year;
}

function extensionFor(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && ALLOWED_EXTENSIONS.has(fromName)) {
    return fromName === 'jpeg' ? 'jpg' : fromName;
  }
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}

function isAllowedImage(file: File): boolean {
  if (ALLOWED_IMAGE_TYPES.has(file.type)) return true;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return Boolean(ext && ALLOWED_EXTENSIONS.has(ext));
}

function readLocalizedFields(formData: FormData) {
  const titleEn = readText(formData, 'title_en');
  const titleZhHant = readText(formData, 'title_zh_hant');
  const titleZhHans = readText(formData, 'title_zh_hans');
  const buildingNameEn = readText(formData, 'building_name_en');
  const buildingNameZhHant = readText(formData, 'building_name_zh_hant');
  const buildingNameZhHans = readText(formData, 'building_name_zh_hans');
  const imageAltEn = readText(formData, 'image_alt_en');
  const imageAltZhHant = readText(formData, 'image_alt_zh_hant');
  const imageAltZhHans = readText(formData, 'image_alt_zh_hans');

  const legacyImageAlt = imageAltEn || buildingNameEn || titleEn;

  return {
    titleEn,
    titleZhHant,
    titleZhHans,
    buildingNameEn,
    buildingNameZhHant,
    buildingNameZhHans,
    imageAltEn,
    imageAltZhHant,
    imageAltZhHans,
    legacyImageAlt,
  };
}

async function uploadProjectImage(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  file: File,
  slug: string,
  preferredName: string,
  previousUrl: string | null,
): Promise<{ publicUrl: string; path: string }> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image must be 8MB or smaller.');
  }
  if (!isAllowedImage(file)) {
    throw new Error('Image must be JPG, PNG, or WebP.');
  }

  const previousPath = previousUrl
    ? storagePathFromPublicUrl(previousUrl, PROJECT_IMAGES_BUCKET)
    : null;
  const previousInSlugFolder =
    previousPath && previousPath.startsWith(`${slug}/`)
      ? previousPath
      : null;

  const baseName = resolveStorageBaseName({
    preferredName,
    uploadedFileName: file.name,
    previousPath: previousInSlugFolder,
    fallback: `image.${extensionFor(file)}`,
    defaultExtension: `.${extensionFor(file)}`,
  });

  const path = `${slug}/${baseName}`;

  return uploadReplacingStorageObject(supabase, {
    bucket: PROJECT_IMAGES_BUCKET,
    file,
    path,
    previousUrl,
    contentType: file.type || undefined,
  });
}

/** Keep a single primary gallery row in sync with projects.image_url. */
async function syncPrimaryGalleryImage(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  projectId: number,
  previousImageUrl: string | null,
  nextImageUrl: string | null,
  fields: ReturnType<typeof readLocalizedFields>,
) {
  if (!nextImageUrl) {
    if (previousImageUrl) {
      await supabase
        .from('project_images')
        .delete()
        .eq('project_id', projectId)
        .eq('image_url', previousImageUrl);
    }
    return;
  }

  if (previousImageUrl) {
    const { data: existingRows } = await supabase
      .from('project_images')
      .select('id')
      .eq('project_id', projectId)
      .eq('image_url', previousImageUrl)
      .limit(1);

    if (existingRows && existingRows.length > 0) {
      const { error } = await supabase
        .from('project_images')
        .update({
          image_url: nextImageUrl,
          caption: fields.legacyImageAlt,
          caption_en: fields.legacyImageAlt,
          caption_zh_hant: fields.imageAltZhHant || null,
          caption_zh_hans: fields.imageAltZhHans || null,
        })
        .eq('id', existingRows[0].id);
      if (error) {
        console.error('Failed to update project_images row:', error);
      }
      return;
    }
  }

  const { error } = await supabase.from('project_images').insert({
    project_id: projectId,
    image_url: nextImageUrl,
    caption: fields.legacyImageAlt,
    caption_en: fields.legacyImageAlt,
    caption_zh_hant: fields.imageAltZhHant || null,
    caption_zh_hans: fields.imageAltZhHans || null,
    image_type: 'gallery',
    sort_order: 0,
  });
  if (error) {
    console.error('Failed to insert project_images row:', error);
  }
}

function revalidatePublicSite() {
  revalidatePath('/', 'layout');
  revalidatePath('/admin/projects');
}

export async function createProject(formData: FormData) {
  const supabase = await requireAdmin();

  const fields = readLocalizedFields(formData);
  const address = readText(formData, 'address');
  const year = parseYear(readText(formData, 'year'));
  const published = formData.get('published') === 'on';
  const slugInput = readText(formData, 'slug');
  const slug =
    slugInput || slugify(fields.titleEn || fields.buildingNameEn);

  if (!fields.titleEn) {
    redirect('/admin/projects/new?error=title');
  }

  let imageUrl: string | null = null;
  const image = formData.get('image');

  try {
    if (image instanceof File && image.size > 0) {
      const preferredName = readText(formData, 'image_filename');
      const uploaded = await uploadProjectImage(
        supabase,
        image,
        slug,
        preferredName,
        null,
      );
      imageUrl = uploaded.publicUrl;
    }
  } catch (error) {
    console.error('Project image upload failed:', error);
    redirect('/admin/projects/new?error=upload');
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      slug,
      title: fields.titleEn,
      title_en: fields.titleEn,
      title_zh_hant: fields.titleZhHant || null,
      title_zh_hans: fields.titleZhHans || null,
      building_name: fields.buildingNameEn || null,
      building_name_en: fields.buildingNameEn || null,
      building_name_zh_hant: fields.buildingNameZhHant || null,
      building_name_zh_hans: fields.buildingNameZhHans || null,
      address: address || null,
      year,
      published,
      image_url: imageUrl,
      image_alt: fields.legacyImageAlt,
      image_alt_en: fields.imageAltEn || fields.legacyImageAlt,
      image_alt_zh_hant: fields.imageAltZhHant || null,
      image_alt_zh_hans: fields.imageAltZhHans || null,
      sort_order: await nextProjectSortOrder(supabase),
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Failed to create project:', error);
    const code = error?.code === '23505' ? 'slug' : 'save';
    redirect(`/admin/projects/new?error=${code}`);
  }

  if (imageUrl) {
    await syncPrimaryGalleryImage(supabase, data.id, null, imageUrl, fields);
  }

  revalidatePublicSite();
  redirect(`/admin/projects/${data.id}?saved=1`);
}

export async function updateProject(formData: FormData) {
  const supabase = await requireAdmin();

  const id = Number(readText(formData, 'id'));
  if (!Number.isFinite(id) || id <= 0) {
    redirect('/admin/projects?error=invalid');
  }

  const fields = readLocalizedFields(formData);
  const address = readText(formData, 'address');
  const year = parseYear(readText(formData, 'year'));
  const published = formData.get('published') === 'on';
  const slugInput = readText(formData, 'slug');
  const slug =
    slugInput || slugify(fields.titleEn || fields.buildingNameEn);
  const clearImage = formData.get('clear_image') === 'on';

  if (!fields.titleEn) {
    redirect(`/admin/projects/${id}?error=title`);
  }

  const { data: existing, error: existingError } = await supabase
    .from('projects')
    .select('image_url')
    .eq('id', id)
    .maybeSingle();

  if (existingError || !existing) {
    redirect('/admin/projects?error=missing');
  }

  const previousImageUrl = existing.image_url as string | null;
  let imageUrl: string | null = previousImageUrl;
  let imageChanged = false;

  if (clearImage) {
    const oldPath = previousImageUrl
      ? storagePathFromPublicUrl(previousImageUrl, PROJECT_IMAGES_BUCKET)
      : null;
    await removeStorageObject(supabase, PROJECT_IMAGES_BUCKET, oldPath);
    imageUrl = null;
    imageChanged = true;
  }

  const image = formData.get('image');
  try {
    if (image instanceof File && image.size > 0) {
      const preferredName = readText(formData, 'image_filename');
      const uploaded = await uploadProjectImage(
        supabase,
        image,
        slug,
        preferredName,
        clearImage ? null : previousImageUrl,
      );
      imageUrl = uploaded.publicUrl;
      imageChanged = true;
    }
  } catch (error) {
    console.error('Project image upload failed:', error);
    redirect(`/admin/projects/${id}?error=upload`);
  }

  const { error } = await supabase
    .from('projects')
    .update({
      slug,
      title: fields.titleEn,
      title_en: fields.titleEn,
      title_zh_hant: fields.titleZhHant || null,
      title_zh_hans: fields.titleZhHans || null,
      building_name: fields.buildingNameEn || null,
      building_name_en: fields.buildingNameEn || null,
      building_name_zh_hant: fields.buildingNameZhHant || null,
      building_name_zh_hans: fields.buildingNameZhHans || null,
      address: address || null,
      year,
      published,
      image_url: imageUrl,
      image_alt: fields.legacyImageAlt,
      image_alt_en: fields.imageAltEn || fields.legacyImageAlt,
      image_alt_zh_hant: fields.imageAltZhHant || null,
      image_alt_zh_hans: fields.imageAltZhHans || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to update project:', error);
    const code = error.code === '23505' ? 'slug' : 'save';
    redirect(`/admin/projects/${id}?error=${code}`);
  }

  if (imageChanged) {
    await syncPrimaryGalleryImage(
      supabase,
      id,
      previousImageUrl,
      imageUrl,
      fields,
    );
  }

  revalidatePublicSite();
  revalidatePath(`/admin/projects/${id}`);
  redirect(`/admin/projects/${id}?saved=1`);
}

/** Saves gallery captions in all three languages for one project. */
export async function updateProjectImageCaptions(formData: FormData) {
  const supabase = await requireAdmin();

  const projectId = Number(readText(formData, 'project_id'));
  if (!Number.isFinite(projectId) || projectId <= 0) {
    redirect('/admin/projects?error=invalid');
  }

  const imageIds = formData
    .getAll('image_id')
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);

  for (const imageId of imageIds) {
    const captionEn = readText(formData, `caption_en_${imageId}`);
    const captionZhHant = readText(formData, `caption_zh_hant_${imageId}`);
    const captionZhHans = readText(formData, `caption_zh_hans_${imageId}`);

    const { error } = await supabase
      .from('project_images')
      .update({
        caption: captionEn || null,
        caption_en: captionEn || null,
        caption_zh_hant: captionZhHant || null,
        caption_zh_hans: captionZhHans || null,
      })
      .eq('id', imageId)
      .eq('project_id', projectId);

    if (error) {
      console.error('Failed to update project image caption:', error);
      redirect(`/admin/projects/${projectId}?error=captions`);
    }
  }

  revalidatePublicSite();
  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?saved=captions`);
}

export async function deleteProject(formData: FormData) {
  const supabase = await requireAdmin();
  const id = Number(readText(formData, 'id'));

  if (!Number.isFinite(id) || id <= 0) {
    redirect('/admin/projects?error=invalid');
  }

  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    console.error('Failed to delete project:', error);
    redirect(`/admin/projects/${id}?error=delete`);
  }

  revalidatePublicSite();
  redirect('/admin/projects?deleted=1');
}

/** Persist a new projects list order (drag-and-drop). */
export async function reorderProjects(
  orderedIds: number[],
): Promise<ReorderResult> {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from('projects')
    .select('id')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to load projects for reorder:', error);
    return { ok: false, error: 'Could not load projects to reorder.' };
  }

  const expectedIds = (data ?? []).map((row) => row.id as number);
  if (!isPermutation(orderedIds, expectedIds)) {
    return {
      ok: false,
      error: 'Order is out of date. Refresh the page and try again.',
    };
  }

  try {
    await writeSequentialSortOrders(supabase, 'projects', orderedIds);
  } catch (reorderError) {
    console.error('Failed to reorder projects:', reorderError);
    return { ok: false, error: 'Could not save the new order.' };
  }

  revalidatePublicSite();
  return { ok: true };
}
