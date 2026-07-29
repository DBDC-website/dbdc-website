import { supabase } from '@/lib/supabaseClient';
import type { Project, ProjectRow } from '@/types/project';

/** List views with optional gallery images for the showcase lightbox. */
const PROJECT_LIST_SELECT = `
  id,
  slug,
  title,
  building_name,
  address,
  year,
  published,
  image_url,
  image_alt
`;

const PROJECT_SHOWCASE_SELECT = `
  ${PROJECT_LIST_SELECT},
  project_images (
    id,
    image_url,
    caption,
    image_type,
    sort_order
  )
`;

/** Encode path segments so filenames with `()` etc. work with Next/Image. */
export function normalizeStorageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    parsed.pathname = parsed.pathname
      .split('/')
      .map((segment) => {
        if (!segment) return segment;
        try {
          return encodeURIComponent(decodeURIComponent(segment));
        } catch {
          return encodeURIComponent(segment);
        }
      })
      .join('/');
    return parsed.toString();
  } catch {
    return url;
  }
}

export function mapProjectRow(row: ProjectRow): Project {
  const gallery =
    row.project_images
      ?.slice()
      .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
      .map((image) => ({
        id: image.id,
        imageUrl: normalizeStorageUrl(image.image_url) ?? image.image_url,
        caption: image.caption,
        imageType: image.image_type,
        sortOrder: image.sort_order,
      })) ?? [];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    buildingName: row.building_name,
    location: row.address ?? '',
    year: row.year?.toString() ?? '',
    published: row.published,
    imageUrl: normalizeStorageUrl(row.image_url),
    imageAlt: row.image_alt ?? row.building_name ?? row.title,
    images: gallery,
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SHOWCASE_SELECT)
    .eq('published', true)
    .order('year', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to fetch published projects:', error);
    return [];
  }

  return (data as ProjectRow[] | null)?.map(mapProjectRow) ?? [];
}

/** Homepage carousel — all published projects. */
export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_LIST_SELECT)
    .eq('published', true)
    .order('year', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to fetch featured projects:', error);
    return [];
  }

  return (data as ProjectRow[] | null)?.map(mapProjectRow) ?? [];
}
