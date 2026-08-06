import { type Locale } from '@/constants/i18n';
import { pickLocalized } from '@/lib/i18n/pickLocalized';
import { normalizeStorageUrl } from '@/lib/projects';
import { supabase } from '@/lib/supabaseClient';
import type {
  CabpagNewsletter,
  CabpagNewsletterRow,
} from '@/types/newsletter';

const NEWSLETTER_SELECT = `
  id,
  title,
  title_zh_hant,
  title_zh_hans,
  published_month,
  published_year,
  pdf_url,
  external_url,
  sort_order,
  active
`;

const MONTH_LABELS: Record<Locale, string[]> = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  'zh-Hant': [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
  'zh-Hans': [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
};

export function formatNewsletterDate(
  month: number,
  year: number,
  locale: Locale,
): string {
  const labels = MONTH_LABELS[locale] ?? MONTH_LABELS.en;
  const monthLabel = labels[month - 1] ?? String(month);
  if (locale === 'en') {
    return `${monthLabel} ${year}`;
  }
  return `${year}年${monthLabel}`;
}

function resolveHref(row: CabpagNewsletterRow): string {
  const pdf = normalizeStorageUrl(row.pdf_url) ?? row.pdf_url?.trim() ?? '';
  if (pdf) return pdf;
  return row.external_url?.trim() ?? '';
}

export function mapNewsletterRow(
  row: CabpagNewsletterRow,
  locale: Locale,
): CabpagNewsletter {
  const record = row as unknown as Record<string, unknown>;
  const titleEn = row.title;
  const pdfUrl =
    normalizeStorageUrl(row.pdf_url) ?? row.pdf_url?.trim() ?? null;
  const externalUrl = row.external_url?.trim() || null;

  return {
    id: row.id,
    title: pickLocalized(record, 'title', locale) || titleEn,
    titleEn,
    titleZhHant: row.title_zh_hant?.trim() || null,
    titleZhHans: row.title_zh_hans?.trim() || null,
    publishedMonth: row.published_month,
    publishedYear: row.published_year,
    dateLabel: formatNewsletterDate(
      row.published_month,
      row.published_year,
      locale,
    ),
    href: resolveHref(row),
    pdfUrl: typeof pdfUrl === 'string' && pdfUrl ? pdfUrl : null,
    externalUrl,
    sortOrder: row.sort_order,
    active: row.active,
  };
}

/** Active CaBPAG newsletters for the public committee page. */
export async function getCabpagNewsletters(
  locale: Locale = 'en',
): Promise<CabpagNewsletter[]> {
  const { data, error } = await supabase
    .from('cabpag_newsletters')
    .select(NEWSLETTER_SELECT)
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to fetch CaBPAG newsletters:', error);
    return [];
  }

  return (
    (data as CabpagNewsletterRow[] | null)?.map((row) =>
      mapNewsletterRow(row, locale),
    ) ?? []
  );
}
