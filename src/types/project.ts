export type ProjectImageType = 'before' | 'after' | 'gallery';

export interface ProjectImage {
  id: number;
  imageUrl: string;
  caption: string | null;
  imageType: ProjectImageType;
  sortOrder: number;
}

/** UI-facing project shape mapped from Supabase `projects`. */
export interface Project {
  id: number;
  slug: string;
  title: string;
  buildingName: string | null;
  location: string;
  year: string;
  published: boolean;
  imageUrl: string | null;
  imageAlt: string;
  images?: ProjectImage[];
}

export type ProjectImageRow = {
  id: number;
  project_id: number;
  image_url: string;
  caption: string | null;
  image_type: ProjectImageType;
  sort_order: number;
};

export type ProjectRow = {
  id: number;
  slug: string;
  title: string;
  building_name: string | null;
  address: string | null;
  year: number | null;
  published: boolean;
  image_url: string | null;
  image_alt: string | null;
  project_images?: ProjectImageRow[] | null;
};
