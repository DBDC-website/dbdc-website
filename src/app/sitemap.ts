import type { MetadataRoute } from 'next';
import { locales } from '@/constants/i18n';
import { absoluteUrl, PUBLIC_PATHS } from '@/lib/i18n/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PUBLIC_PATHS) {
    for (const locale of locales) {
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [loc, absoluteUrl(loc, path)]),
          ),
        },
      });
    }
  }

  return entries;
}
