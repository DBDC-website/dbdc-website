export type ProjectImageType = 'before' | 'after' | 'gallery';

export interface ProjectImage {
  id: number;
  imageUrl: string;
  caption: string | null;
  imageType: ProjectImageType;
  sortOrder: number;
}

/** UI-facing project shape mapped from Supabase `projects` + `project_images`. */
export interface Project {
  id: number;
  slug: string;
  title: string;
  buildingName: string | null;
  description: string;
  location: string;
  parish: string | null;
  deanery: string | null;
  natureOfWork: string | null;
  year: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
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
  description: string | null;
  address: string | null;
  parish: string | null;
  deanery: string | null;
  nature_of_work: string | null;
  year: number | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  project_images?: ProjectImageRow[] | null;
};
