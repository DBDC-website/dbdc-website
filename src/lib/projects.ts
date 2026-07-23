import { supabase } from '@/lib/supabaseClient';
import type { Project, ProjectRow } from '@/types/project';

/** Max projects shown in the homepage carousel (featured column was removed). */
const FEATURED_LIMIT = 8;

/** List/card views only need the primary image on `projects` — skip gallery join. */
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
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_LIST_SELECT)
    .eq('published', true)
    .order('year', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to fetch published projects:', error);
    return [];
  }

  return (data as ProjectRow[] | null)?.map(mapProjectRow) ?? [];
}

/** Homepage carousel — published projects, capped for display. */
export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_LIST_SELECT)
    .eq('published', true)
    .order('year', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true })
    .limit(FEATURED_LIMIT);

  if (error) {
    console.error('Failed to fetch featured projects:', error);
    return [];
  }

  return (data as ProjectRow[] | null)?.map(mapProjectRow) ?? [];
}
