import type { Locale } from '@/constants/i18n';
import { defaultLocale } from '@/constants/i18n';
import {
  pickLocalized,
  pickLocalizedOptional,
} from '@/lib/i18n/pickLocalized';
import { supabase } from '@/lib/supabaseClient';
import type { Project, ProjectRow } from '@/types/project';

/** List views with optional gallery images for the showcase lightbox. */
const PROJECT_LIST_SELECT_LEGACY = `
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

const PROJECT_LIST_SELECT = `
  ${PROJECT_LIST_SELECT_LEGACY},
  title_en,
  title_zh_hant,
  title_zh_hans,
  building_name_en,
  building_name_zh_hant,
  building_name_zh_hans,
  image_alt_en,
  image_alt_zh_hant,
  image_alt_zh_hans
`;

const PROJECT_SHOWCASE_SELECT_LEGACY = `
  ${PROJECT_LIST_SELECT_LEGACY},
  project_images (
    id,
    image_url,
    caption,
    image_type,
    sort_order
  )
`;

const PROJECT_SHOWCASE_SELECT = `
  ${PROJECT_LIST_SELECT},
  project_images (
    id,
    image_url,
    caption,
    caption_en,
    caption_zh_hant,
    caption_zh_hans,
    image_type,
    sort_order
  )
`;

/** Encode path segments so filenames with `()` etc. work with Next/Image. */
export function normalizeStorageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    parsed.pathname = parsed.pathname
      .split('/')
      .map((segment) => {
        if (!segment) return segment;
        try {
          return encodeURIComponent(decodeURIComponent(segment));
        } catch {
          return encodeURIComponent(segment);
        }
      })
      .join('/');
    return parsed.toString();
  } catch {
    return url;
  }
}

export function mapProjectRow(
  row: ProjectRow,
  locale: Locale = defaultLocale,
): Project {
  const record = row as unknown as Record<string, unknown>;
  const title = pickLocalized(record, 'title', locale);
  const buildingName = pickLocalizedOptional(record, 'building_name', locale);
  const imageAlt =
    pickLocalizedOptional(record, 'image_alt', locale) ??
    buildingName ??
    title;

  const gallery =
    row.project_images
      ?.slice()
      .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
      .map((image) => {
        const imageRecord = image as unknown as Record<string, unknown>;
        return {
          id: image.id,
          imageUrl: normalizeStorageUrl(image.image_url) ?? image.image_url,
          caption: pickLocalizedOptional(imageRecord, 'caption', locale),
          imageType: image.image_type,
          sortOrder: image.sort_order,
        };
      }) ?? [];

  return {
    id: row.id,
    slug: row.slug,
    title,
    buildingName,
    location: row.address ?? '',
    year: row.year?.toString() ?? '',
    published: row.published,
    imageUrl: normalizeStorageUrl(row.image_url),
    imageAlt,
    images: gallery,
  };
}

export async function getPublishedProjects(
  locale: Locale = defaultLocale,
): Promise<Project[]> {
  const primary = await supabase
    .from('projects')
    .select(PROJECT_SHOWCASE_SELECT)
    .eq('published', true)
    .order('year', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true });

  const result =
    primary.error != null
      ? await supabase
          .from('projects')
          .select(PROJECT_SHOWCASE_SELECT_LEGACY)
          .eq('published', true)
          .order('year', { ascending: false, nullsFirst: false })
          .order('id', { ascending: true })
      : primary;

  if (result.error) {
    console.error('Failed to fetch published projects:', result.error);
    return [];
  }

  return (
    (result.data as ProjectRow[] | null)?.map((row) =>
      mapProjectRow(row, locale),
    ) ?? []
  );
}

/** Homepage carousel — all published projects. */
export async function getFeaturedProjects(
  locale: Locale = defaultLocale,
): Promise<Project[]> {
  const primary = await supabase
    .from('projects')
    .select(PROJECT_LIST_SELECT)
    .eq('published', true)
    .order('year', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true });

  const result =
    primary.error != null
      ? await supabase
          .from('projects')
          .select(PROJECT_LIST_SELECT_LEGACY)
          .eq('published', true)
          .order('year', { ascending: false, nullsFirst: false })
          .order('id', { ascending: true })
      : primary;

  if (result.error) {
    console.error('Failed to fetch featured projects:', result.error);
    return [];
  }

  return (
    (result.data as ProjectRow[] | null)?.map((row) =>
      mapProjectRow(row, locale),
    ) ?? []
  );
}
