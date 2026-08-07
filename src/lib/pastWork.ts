import type { Locale } from '@/constants/i18n';
import { defaultLocale } from '@/constants/i18n';
import { pickLocalized } from '@/lib/i18n/pickLocalized';
import { normalizeStorageUrl } from '@/lib/projects';
import { supabase } from '@/lib/supabaseClient';
import type {
  PastWorkCommitteeSlug,
  PastWorkItemRow,
  PastWorkYear,
  PastWorkYearRow,
} from '@/types/pastWork';

function resolveHref(row: PastWorkItemRow): string | null {
  const file = row.file_url?.trim();
  if (file) return normalizeStorageUrl(file) ?? file;
  const link = row.link_url?.trim();
  return link || null;
}

function mapItem(row: PastWorkItemRow, locale: Locale) {
  const record = row as unknown as Record<string, unknown>;
  return {
    id: row.id,
    text: pickLocalized(record, 'text', locale),
    href: resolveHref(row),
  };
}

/** Public Past Work years + items for one committee, oldest year first. */
export async function getCommitteePastWork(
  committeeSlug: PastWorkCommitteeSlug,
  locale: Locale = defaultLocale,
): Promise<PastWorkYear[]> {
  const { data: years, error: yearsError } = await supabase
    .from('committee_past_work_years')
    .select('id, committee_slug, year, sort_order')
    .eq('committee_slug', committeeSlug)
    .order('sort_order', { ascending: false });

  if (yearsError) {
    console.error('Failed to fetch past work years:', yearsError);
    return [];
  }

  const yearRows = (years as PastWorkYearRow[] | null) ?? [];
  if (yearRows.length === 0) return [];

  const yearIds = yearRows.map((row) => row.id);
  const { data: items, error: itemsError } = await supabase
    .from('committee_past_work_items')
    .select(
      'id, year_id, text, text_en, text_zh_hant, text_zh_hans, link_url, file_url, sort_order',
    )
    .in('year_id', yearIds)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (itemsError) {
    console.error('Failed to fetch past work items:', itemsError);
    return [];
  }

  const itemRows = (items as PastWorkItemRow[] | null) ?? [];
  const byYear = new Map<number, PastWorkItemRow[]>();
  for (const item of itemRows) {
    const list = byYear.get(item.year_id) ?? [];
    list.push(item);
    byYear.set(item.year_id, list);
  }

  return yearRows
    .map((year) => ({
      id: year.id,
      committeeSlug: year.committee_slug,
      year: year.year,
      items: (byYear.get(year.id) ?? []).map((item) => mapItem(item, locale)),
    }))
    .filter((year) => year.items.length > 0);
}
