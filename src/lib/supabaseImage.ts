type SupabaseImageTransform = {
  width: number;
  quality: number;
};

const SUPABASE_STORAGE_MARKER = '/storage/v1/object/public/';

function isSupabaseStorageUrl(src: string): boolean {
  if (!src.startsWith('http://') && !src.startsWith('https://')) return false;
  return src.includes('.supabase.co') && src.includes(SUPABASE_STORAGE_MARKER);
}

export function withSupabaseImageTransform(
  src: string,
  { width, quality }: SupabaseImageTransform,
): string {
  if (!isSupabaseStorageUrl(src)) return src;

  try {
    const url = new URL(src);
    url.searchParams.set('width', String(width));
    url.searchParams.set('quality', String(quality));
    return url.toString();
  } catch {
    return src;
  }
}

export type { SupabaseImageTransform };
