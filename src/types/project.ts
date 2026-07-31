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
  caption_en?: string | null;
  caption_zh_hant?: string | null;
  caption_zh_hans?: string | null;
  image_type: ProjectImageType;
  sort_order: number;
};

export type ProjectRow = {
  id: number;
  slug: string;
  title: string;
  title_en?: string | null;
  title_zh_hant?: string | null;
  title_zh_hans?: string | null;
  building_name: string | null;
  building_name_en?: string | null;
  building_name_zh_hant?: string | null;
  building_name_zh_hans?: string | null;
  address: string | null;
  year: number | null;
  published: boolean;
  image_url: string | null;
  image_alt: string | null;
  image_alt_en?: string | null;
  image_alt_zh_hant?: string | null;
  image_alt_zh_hans?: string | null;
  project_images?: ProjectImageRow[] | null;
};
