import type { Project } from '@/types/project';

export type ProjectPlaceholderStyle = 'heritage' | 'construction' | 'modern';

export type ProjectPlaceholder = {
  style: ProjectPlaceholderStyle;
  label: string;
  sublabel: string;
  gradient: string;
};

/** Visual fallback when a project has no photography yet. */
const featuredPlaceholders: Record<number, ProjectPlaceholder> = {
  1: {
    style: 'heritage',
    label: 'Heritage',
    sublabel: 'Church building · restoration',
    gradient: 'from-gold-100 via-cream-200 to-brand-200',
  },
  2: {
    style: 'construction',
    label: 'Under construction',
    sublabel: 'Renovation site · new build',
    gradient: 'from-sage-100 via-brand-100 to-sage-200',
  },
  3: {
    style: 'modern',
    label: 'Modern',
    sublabel: 'Contemporary parish architecture',
    gradient: 'from-brand-100 via-cream-100 to-sage-100',
  },
  7: {
    style: 'heritage',
    label: 'Parish hall',
    sublabel: 'Community space · renovation',
    gradient: 'from-cream-200 via-gold-100 to-brand-100',
  },
  8: {
    style: 'construction',
    label: 'Chapel extension',
    sublabel: 'New ancillary works',
    gradient: 'from-brand-100 via-sage-100 to-cream-200',
  },
};

const defaultPlaceholder: ProjectPlaceholder = {
  style: 'modern',
  label: 'Project image',
  sublabel: 'Church or Diocesan building',
  gradient: 'from-brand-200 via-cream-100 to-sage-200',
};

export function getProjectPlaceholder(project: Project): ProjectPlaceholder {
  return featuredPlaceholders[project.id] ?? defaultPlaceholder;
}
