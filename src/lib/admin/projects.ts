import { createClient } from '@/lib/supabase/server';
import { normalizeStorageUrl } from '@/lib/projects';
import type { ProjectRow } from '@/types/project';

const ADMIN_PROJECT_SELECT = `
  id,
  slug,
  title,
  title_en,
  title_zh_hant,
  title_zh_hans,
  building_name,
  building_name_en,
  building_name_zh_hant,
  building_name_zh_hans,
  address,
  year,
  published,
  image_url,
  image_alt,
  image_alt_en,
  image_alt_zh_hant,
  image_alt_zh_hans,
  sort_order
`;

export type AdminProject = {
  id: number;
  slug: string;
  /** Display title: English column, else legacy title. */
  title: string;
  titleEn: string;
  titleZhHant: string | null;
  titleZhHans: string | null;
  buildingName: string | null;
  buildingNameEn: string | null;
  buildingNameZhHant: string | null;
  buildingNameZhHans: string | null;
  address: string | null;
  year: number | null;
  published: boolean;
  sortOrder: number;
  imageUrl: string | null;
  imageAlt: string | null;
  imageAltEn: string | null;
  imageAltZhHant: string | null;
  imageAltZhHans: string | null;
};

function mapRow(row: ProjectRow): AdminProject {
  const titleEn = row.title_en?.trim() || row.title;
  const buildingNameEn =
    row.building_name_en?.trim() || row.building_name || null;
  const imageAltEn = row.image_alt_en?.trim() || row.image_alt || null;

  return {
    id: row.id,
    slug: row.slug,
    title: titleEn,
    titleEn,
    titleZhHant: row.title_zh_hant?.trim() || null,
    titleZhHans: row.title_zh_hans?.trim() || null,
    buildingName: buildingNameEn,
    buildingNameEn,
    buildingNameZhHant: row.building_name_zh_hant?.trim() || null,
    buildingNameZhHans: row.building_name_zh_hans?.trim() || null,
    address: row.address,
    year: row.year,
    published: row.published,
    sortOrder: row.sort_order ?? 0,
    imageUrl: normalizeStorageUrl(row.image_url),
    imageAlt: imageAltEn,
    imageAltEn,
    imageAltZhHant: row.image_alt_zh_hant?.trim() || null,
    imageAltZhHans: row.image_alt_zh_hans?.trim() || null,
  };
}

export async function listAdminProjects(): Promise<AdminProject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(ADMIN_PROJECT_SELECT)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to list admin projects:', error);
    return [];
  }

  return (data as ProjectRow[] | null)?.map(mapRow) ?? [];
}

export type AdminProjectImage = {
  id: number;
  imageUrl: string | null;
  captionEn: string | null;
  captionZhHant: string | null;
  captionZhHans: string | null;
  sortOrder: number;
};

type ProjectImageRow = {
  id: number;
  image_url: string | null;
  caption: string | null;
  caption_en: string | null;
  caption_zh_hant: string | null;
  caption_zh_hans: string | null;
  sort_order: number;
};

export async function listAdminProjectImages(
  projectId: number,
): Promise<AdminProjectImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('project_images')
    .select(
      'id, image_url, caption, caption_en, caption_zh_hant, caption_zh_hans, sort_order',
    )
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to list project images:', error);
    return [];
  }

  return (
    (data as ProjectImageRow[] | null)?.map((row) => ({
      id: row.id,
      imageUrl: normalizeStorageUrl(row.image_url),
      captionEn: row.caption_en?.trim() || row.caption?.trim() || null,
      captionZhHant: row.caption_zh_hant?.trim() || null,
      captionZhHans: row.caption_zh_hans?.trim() || null,
      sortOrder: row.sort_order,
    })) ?? []
  );
}

export async function getAdminProject(
  id: number,
): Promise<AdminProject | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(ADMIN_PROJECT_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Failed to load admin project:', error);
    return null;
  }

  return data ? mapRow(data as ProjectRow) : null;
}
