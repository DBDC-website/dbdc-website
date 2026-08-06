import { createClient } from '@/lib/supabase/server';
import { formatNewsletterDate, mapNewsletterRow } from '@/lib/newsletters';
import { normalizeStorageUrl } from '@/lib/projects';
import type {
  CabpagNewsletter,
  CabpagNewsletterRow,
} from '@/types/newsletter';

const ADMIN_NEWSLETTER_SELECT = `
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

export type AdminCabpagNewsletter = CabpagNewsletter;

function mapAdminRow(row: CabpagNewsletterRow): AdminCabpagNewsletter {
  const mapped = mapNewsletterRow(row, 'en');
  const pdfRaw =
    normalizeStorageUrl(row.pdf_url) ?? row.pdf_url?.trim() ?? '';
  return {
    ...mapped,
    pdfUrl: pdfRaw || null,
    externalUrl: row.external_url?.trim() || null,
    dateLabel: formatNewsletterDate(
      row.published_month,
      row.published_year,
      'en',
    ),
  };
}

export async function listAdminCabpagNewsletters(): Promise<
  AdminCabpagNewsletter[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cabpag_newsletters')
    .select(ADMIN_NEWSLETTER_SELECT)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to list CaBPAG newsletters:', error);
    return [];
  }

  return (data as CabpagNewsletterRow[] | null)?.map(mapAdminRow) ?? [];
}

export async function getAdminCabpagNewsletter(
  id: number,
): Promise<AdminCabpagNewsletter | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cabpag_newsletters')
    .select(ADMIN_NEWSLETTER_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Failed to load CaBPAG newsletter:', error);
    return null;
  }

  return data ? mapAdminRow(data as CabpagNewsletterRow) : null;
}

/** New newsletters are inserted at the top (sort_order 1); existing rows shift down. */
export async function prependCabpagNewsletterSortOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<number> {
  const { data, error } = await supabase
    .from('cabpag_newsletters')
    .select('id, sort_order');

  if (error) {
    console.error('Failed to shift newsletter sort orders:', error);
    return 1;
  }

  await Promise.all(
    (data ?? []).map((row) =>
      supabase
        .from('cabpag_newsletters')
        .update({
          sort_order: (row.sort_order as number) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', row.id as number),
    ),
  );

  return 1;
}

export async function nextCabpagNewsletterSortOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<number> {
  return prependCabpagNewsletterSortOrder(supabase);
}
