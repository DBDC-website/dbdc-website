import type { SupabaseClient } from '@supabase/supabase-js';

type ReorderTable = 'committee_members' | 'articles' | 'projects';

export type ReorderResult = { ok: true } | { ok: false; error: string };

/**
 * Write contiguous 1…n sort_order values for the given id sequence.
 * Updates run sequentially so partial failures are easier to spot.
 */
export async function writeSequentialSortOrders(
  supabase: SupabaseClient,
  table: ReorderTable,
  orderedIds: number[],
): Promise<void> {
  const now = new Date().toISOString();

  for (let index = 0; index < orderedIds.length; index += 1) {
    const id = orderedIds[index];
    const payload =
      table === 'articles'
        ? { sort_order: index + 1 }
        : { sort_order: index + 1, updated_at: now };

    const { error } = await supabase.from(table).update(payload).eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}

/** True when `orderedIds` is a permutation of `expectedIds`. */
export function isPermutation(
  orderedIds: number[],
  expectedIds: number[],
): boolean {
  if (orderedIds.length !== expectedIds.length) return false;
  if (orderedIds.some((id) => !Number.isFinite(id) || id <= 0)) return false;

  const expected = new Set(expectedIds);
  if (expected.size !== expectedIds.length) return false;

  const seen = new Set<number>();
  for (const id of orderedIds) {
    if (!expected.has(id) || seen.has(id)) return false;
    seen.add(id);
  }
  return true;
}
