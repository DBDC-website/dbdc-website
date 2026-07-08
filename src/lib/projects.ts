import { supabase } from '@/lib/supabaseClient';
import type { Project, ProjectImageRow, ProjectRow } from '@/types/project';

const PROJECT_SELECT = `
  *,
  project_images (
    id,
    project_id,
    image_url,
    caption,
    image_type,
    sort_order
  )
`;

function sortImages(images: ProjectImageRow[]): ProjectImageRow[] {
  return [...images].sort((a, b) => a.sort_order - b.sort_order);
}

function pickPrimaryImage(images: ProjectImageRow[]): ProjectImageRow | undefined {
  const sorted = sortImages(images);
  return sorted.find((image) => image.image_type === 'gallery') ?? sorted[0];
}

export function mapProjectRow(row: ProjectRow): Project {
  const images = sortImages(row.project_images ?? []);
  const primary = pickPrimaryImage(images);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    buildingName: row.building_name,
    description: row.description ?? '',
    location: row.address ?? row.parish ?? row.deanery ?? '',
    parish: row.parish,
    deanery: row.deanery,
    natureOfWork: row.nature_of_work,
    year: row.year?.toString() ?? '',
    featured: row.featured,
    published: row.published,
    sortOrder: row.sort_order,
    imageUrl: primary?.image_url ?? null,
    imageAlt: primary?.caption ?? row.building_name ?? row.title,
    images: images.map((image) => ({
      id: image.id,
      imageUrl: image.image_url,
      caption: image.caption,
      imageType: image.image_type,
      sortOrder: image.sort_order,
    })),
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Failed to fetch published projects:', error);
    return [];
  }

  return (data as ProjectRow[] | null)?.map(mapProjectRow) ?? [];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('published', true)
    .eq('featured', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Failed to fetch featured projects:', error);
    return [];
  }

  return (data as ProjectRow[] | null)?.map(mapProjectRow) ?? [];
}
