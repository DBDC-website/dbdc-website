'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PROJECT_IMAGES_BUCKET } from '@/constants/admin';
import { requireAdmin } from '@/lib/admin/requireAdmin';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

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

function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .slice(-120);
}

function extensionFor(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}

async function uploadProjectImage(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  file: File,
  slug: string,
): Promise<{ publicUrl: string; path: string }> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image must be 8MB or smaller.');
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Image must be JPG, PNG, or WebP.');
  }

  const path = `${slug}/${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(file.name) || `image.${extensionFor(file)}`}`;

  const { error } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .upload(path, file, {
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PROJECT_IMAGES_BUCKET).getPublicUrl(path);

  return { publicUrl, path };
}

function revalidatePublicSite() {
  revalidatePath('/', 'layout');
  revalidatePath('/admin/projects');
}

export async function createProject(formData: FormData) {
  const supabase = await requireAdmin();

  const title = readText(formData, 'title');
  const buildingName = readText(formData, 'building_name');
  const address = readText(formData, 'address');
  const year = parseYear(readText(formData, 'year'));
  const imageAlt = readText(formData, 'image_alt');
  const published = formData.get('published') === 'on';
  const slugInput = readText(formData, 'slug');
  const slug = slugInput || slugify(title || buildingName);

  if (!title) {
    redirect('/admin/projects/new?error=title');
  }

  let imageUrl: string | null = null;
  const image = formData.get('image');

  try {
    if (image instanceof File && image.size > 0) {
      const uploaded = await uploadProjectImage(supabase, image, slug);
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
      title,
      building_name: buildingName || null,
      address: address || null,
      year,
      published,
      image_url: imageUrl,
      image_alt: imageAlt || buildingName || title,
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
    const { error: imageError } = await supabase.from('project_images').insert({
      project_id: data.id,
      image_url: imageUrl,
      caption: imageAlt || buildingName || title,
      image_type: 'gallery',
      sort_order: 0,
    });
    if (imageError) {
      console.error('Failed to insert project_images row:', imageError);
    }
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

  const title = readText(formData, 'title');
  const buildingName = readText(formData, 'building_name');
  const address = readText(formData, 'address');
  const year = parseYear(readText(formData, 'year'));
  const imageAlt = readText(formData, 'image_alt');
  const published = formData.get('published') === 'on';
  const slugInput = readText(formData, 'slug');
  const slug = slugInput || slugify(title || buildingName);
  const clearImage = formData.get('clear_image') === 'on';

  if (!title) {
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

  let imageUrl: string | null = existing.image_url as string | null;
  if (clearImage) {
    imageUrl = null;
  }

  const image = formData.get('image');
  try {
    if (image instanceof File && image.size > 0) {
      const uploaded = await uploadProjectImage(supabase, image, slug);
      imageUrl = uploaded.publicUrl;

      const { error: imageError } = await supabase.from('project_images').insert({
        project_id: id,
        image_url: imageUrl,
        caption: imageAlt || buildingName || title,
        image_type: 'gallery',
        sort_order: 0,
      });
      if (imageError) {
        console.error('Failed to insert project_images row:', imageError);
      }
    }
  } catch (error) {
    console.error('Project image upload failed:', error);
    redirect(`/admin/projects/${id}?error=upload`);
  }

  const { error } = await supabase
    .from('projects')
    .update({
      slug,
      title,
      building_name: buildingName || null,
      address: address || null,
      year,
      published,
      image_url: imageUrl,
      image_alt: imageAlt || buildingName || title,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to update project:', error);
    const code = error.code === '23505' ? 'slug' : 'save';
    redirect(`/admin/projects/${id}?error=${code}`);
  }

  revalidatePublicSite();
  revalidatePath(`/admin/projects/${id}`);
  redirect(`/admin/projects/${id}?saved=1`);
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
