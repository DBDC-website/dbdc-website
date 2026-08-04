import type { SupabaseClient } from '@supabase/supabase-js';

type StorageClient = Pick<SupabaseClient, 'storage'>;

export function sanitizeStorageFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .slice(-120);
}

/** Object path inside a public bucket URL, or null if it is not that bucket. */
export function storagePathFromPublicUrl(
  url: string,
  bucket: string,
): string | null {
  const marker = `/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  const path = url.slice(index + marker.length).split('?')[0];
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

export function fileNameFromStoragePath(path: string | null | undefined): string {
  if (!path) return '';
  return path.split('/').pop() || path;
}

/**
 * Prefer a typed name, else the previous object basename, else the chosen file.
 * Ensures `defaultExtension` (e.g. `.pdf`) when missing.
 */
export function resolveStorageBaseName(options: {
  preferredName: string;
  uploadedFileName: string;
  previousPath: string | null;
  fallback: string;
  defaultExtension?: string;
}): string {
  const {
    preferredName,
    uploadedFileName,
    previousPath,
    fallback,
    defaultExtension,
  } = options;

  const raw =
    preferredName ||
    fileNameFromStoragePath(previousPath) ||
    uploadedFileName ||
    fallback;
  let base = sanitizeStorageFileName(raw.split('/').pop() || raw) || fallback;

  if (defaultExtension) {
    const ext = defaultExtension.startsWith('.')
      ? defaultExtension
      : `.${defaultExtension}`;
    if (!base.toLowerCase().endsWith(ext.toLowerCase())) {
      base = `${base}${ext}`;
    }
  }

  return base;
}

export async function removeStorageObject(
  supabase: StorageClient,
  bucket: string,
  path: string | null,
): Promise<void> {
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error(`Failed to remove storage object ${bucket}/${path}:`, error);
  }
}

/**
 * Upload with a readable name. Replaces in place when the path matches the
 * previous object; otherwise uploads to the new path and deletes the old one.
 */
export async function uploadReplacingStorageObject(
  supabase: StorageClient,
  options: {
    bucket: string;
    file: File;
    /** Final object key inside the bucket (may include folders). */
    path: string;
    previousUrl?: string | null;
    contentType?: string;
  },
): Promise<{ publicUrl: string; path: string }> {
  const { bucket, file, path, previousUrl, contentType } = options;
  const previousPath = previousUrl
    ? storagePathFromPublicUrl(previousUrl, bucket)
    : null;

  if (previousPath && previousPath === path) {
    await removeStorageObject(supabase, bucket, previousPath);
  }

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: contentType || file.type || undefined,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (previousPath && previousPath !== path) {
    await removeStorageObject(supabase, bucket, previousPath);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return { publicUrl, path };
}
