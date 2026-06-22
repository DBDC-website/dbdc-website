export type ProjectStatus =
  | 'Completed'
  | 'In Progress'
  | 'Planning'
  | 'Upcoming';

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  location: string;
  year: string;
  category: string;
  status: ProjectStatus;
  featured: boolean;
  /** Alt text for the (future) project image. Authored now for accessibility. */
  imageAlt: string;
}
