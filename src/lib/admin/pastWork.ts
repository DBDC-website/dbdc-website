import { createClient } from '@/lib/supabase/server';
import { normalizeStorageUrl } from '@/lib/projects';
import type { PastWorkAdminSlug } from '@/constants/admin';
import type {
  PastWorkItemRow,
  PastWorkYearRow,
} from '@/types/pastWork';

export type AdminPastWorkYear = {
  id: number;
  committeeSlug: PastWorkAdminSlug;
  year: number;
  allowsLinks: boolean;
  itemCount: number;
};

export type AdminPastWorkItem = {
  id: number;
  yearId: number;
  textEn: string;
  textZhHant: string | null;
  textZhHans: string | null;
  linkUrl: string | null;
  fileUrl: string | null;
  sortOrder: number;
};

export type AdminPastWorkYearDetail = {
  id: number;
  committeeSlug: PastWorkAdminSlug;
  year: number;
  allowsLinks: boolean;
  items: AdminPastWorkItem[];
};

function mapItem(row: PastWorkItemRow): AdminPastWorkItem {
  const textEn = row.text_en?.trim() || row.text;
  return {
    id: row.id,
    yearId: row.year_id,
    textEn,
    textZhHant: row.text_zh_hant?.trim() || null,
    textZhHans: row.text_zh_hans?.trim() || null,
    linkUrl: row.link_url?.trim() || null,
    fileUrl: normalizeStorageUrl(row.file_url) ?? row.file_url,
    sortOrder: row.sort_order,
  };
}

export async function listAdminPastWorkYears(
  committeeSlug?: PastWorkAdminSlug,
): Promise<AdminPastWorkYear[]> {
  const supabase = await createClient();
  let query = supabase
    .from('committee_past_work_years')
    .select('id, committee_slug, year, sort_order, allows_links')
    .order('committee_slug', { ascending: true })
    .order('year', { ascending: false });

  if (committeeSlug) {
    query = query.eq('committee_slug', committeeSlug);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Failed to list past work years:', error);
    return [];
  }

  const years = (data as PastWorkYearRow[] | null) ?? [];
  if (years.length === 0) return [];

  const { data: counts, error: countError } = await supabase
    .from('committee_past_work_items')
    .select('year_id')
    .in(
      'year_id',
      years.map((y) => y.id),
    );

  if (countError) {
    console.error('Failed to count past work items:', countError);
  }

  const countMap = new Map<number, number>();
  for (const row of counts ?? []) {
    const id = row.year_id as number;
    countMap.set(id, (countMap.get(id) ?? 0) + 1);
  }

  return years.map((year) => ({
    id: year.id,
    committeeSlug: year.committee_slug as PastWorkAdminSlug,
    year: year.year,
    allowsLinks: Boolean(year.allows_links),
    itemCount: countMap.get(year.id) ?? 0,
  }));
}

export async function getAdminPastWorkYear(
  id: number,
): Promise<AdminPastWorkYearDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('committee_past_work_years')
    .select('id, committee_slug, year, allows_links')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    console.error('Failed to load past work year:', error);
    return null;
  }

  const year = data as PastWorkYearRow;
  const { data: items, error: itemsError } = await supabase
    .from('committee_past_work_items')
    .select(
      'id, year_id, text, text_en, text_zh_hant, text_zh_hans, link_url, file_url, sort_order',
    )
    .eq('year_id', id)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (itemsError) {
    console.error('Failed to load past work items:', itemsError);
    return null;
  }

  return {
    id: year.id,
    committeeSlug: year.committee_slug as PastWorkAdminSlug,
    year: year.year,
    allowsLinks: Boolean(year.allows_links),
    items: ((items as PastWorkItemRow[] | null) ?? []).map(mapItem),
  };
}

export async function nextItemSortOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  yearId: number,
): Promise<number> {
  const { data, error } = await supabase
    .from('committee_past_work_items')
    .select('sort_order')
    .eq('year_id', yearId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return 1;
  return (data.sort_order as number) + 1;
}
