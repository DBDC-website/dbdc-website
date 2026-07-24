import { createClient } from '@/lib/supabase/server';
import { normalizeStorageUrl } from '@/lib/projects';
import type { ProjectRow } from '@/types/project';

const ADMIN_PROJECT_SELECT = `
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

export type AdminProject = {
  id: number;
  slug: string;
  title: string;
  buildingName: string | null;
  address: string | null;
  year: number | null;
  published: boolean;
  imageUrl: string | null;
  imageAlt: string | null;
};

function mapRow(row: ProjectRow): AdminProject {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    buildingName: row.building_name,
    address: row.address,
    year: row.year,
    published: row.published,
    imageUrl: normalizeStorageUrl(row.image_url),
    imageAlt: row.image_alt,
  };
}

export async function listAdminProjects(): Promise<AdminProject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(ADMIN_PROJECT_SELECT)
    .order('year', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to list admin projects:', error);
    return [];
  }

  return (data as ProjectRow[] | null)?.map(mapRow) ?? [];
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
