import type { Project } from '@/types/project';

/**
 * Placeholder project catalogue for Sprint 1.
 * Shape mirrors the future Supabase / CMS model so Sprint 2 can swap the
 * source without touching components.
 */
export const projects: Project[] = [
  {
    id: 1,
    slug: 'st-marys-church-renovation',
    title: 'St. Mary’s Church Renovation',
    description:
      'Structural upgrades and accessibility improvements to support parish activities and preserve heritage fabric.',
    location: 'Hong Kong Island',
    year: '2024',
    category: 'Restoration',
    status: 'In Progress',
    featured: true,
    imageAlt: 'Exterior of St. Mary’s Church during renovation works',
  },
  {
    id: 2,
    slug: 'new-parish-centre-kowloon',
    title: 'New Parish Centre – Kowloon',
    description:
      'A multi-purpose parish centre with meeting rooms, offices, and community facilities for a growing congregation.',
    location: 'Kowloon',
    year: '2025',
    category: 'New Build',
    status: 'Planning',
    featured: true,
    imageAlt: 'Architectural concept of the new Kowloon parish centre',
  },
  {
    id: 3,
    slug: 'diocesan-office-refurbishment',
    title: 'Diocesan Office Refurbishment',
    description:
      'Interior refurbishment and building services upgrade for improved workplace safety and energy efficiency.',
    location: 'Central',
    year: '2025',
    category: 'Refurbishment',
    status: 'Upcoming',
    featured: true,
    imageAlt: 'Refurbished diocesan office interior',
  },
  {
    id: 4,
    slug: 'catholic-school-extension',
    title: 'Catholic School Extension',
    description:
      'Extension of teaching facilities and a new multi-function hall to serve the school community.',
    location: 'New Territories',
    year: '2023',
    category: 'Education',
    status: 'Completed',
    featured: false,
    imageAlt: 'Completed school extension building',
  },
  {
    id: 5,
    slug: 'heritage-chapel-conservation',
    title: 'Heritage Chapel Conservation',
    description:
      'Conservation of a historic chapel, including roof restoration and protection of decorative finishes.',
    location: 'Hong Kong Island',
    year: '2022',
    category: 'Conservation',
    status: 'Completed',
    featured: false,
    imageAlt: 'Restored historic chapel interior',
  },
  {
    id: 6,
    slug: 'columbarium-facility-upgrade',
    title: 'Columbarium Facility Upgrade',
    description:
      'Upgrade of columbarium facilities with improved circulation, ventilation, and visitor amenities.',
    location: 'Kowloon',
    year: '2024',
    category: 'Facilities',
    status: 'In Progress',
    featured: false,
    imageAlt: 'Upgraded columbarium facility',
  },
];

export const featuredProjects: Project[] = projects.filter(
  (project) => project.featured,
);
