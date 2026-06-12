export interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  images: string[];
}

export interface FeaturedProject {
  id: number;
  title: string;
  description: string;
  status: string;
}
