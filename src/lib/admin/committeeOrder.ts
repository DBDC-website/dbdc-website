import type { SupabaseClient } from '@supabase/supabase-js';
import {
  matchCommitteeRoleOption,
  type AdminCommitteeSlug,
} from '@/constants/admin';

type OrderRow = {
  id: number;
  role: string | null;
  sort_order: number;
};

/** Role band used to auto-place new members when sort order is left blank. */
function roleBand(role: string | null | undefined): number {
  const matched = matchCommitteeRoleOption(role);
  switch (matched) {
    case 'Ex-officio':
      return 1;
    case 'Chairman':
      return 2;
    case 'Vice-chairman':
      return 3;
    case 'Member':
      return 4;
    case 'Administrator':
      return 5;
    default:
      return 4;
  }
}

async function listOrderedMembers(
  supabase: SupabaseClient,
  committeeSlug: AdminCommitteeSlug,
): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from('committee_members')
    .select('id, role, sort_order')
    .eq('committee_slug', committeeSlug)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as OrderRow[] | null) ?? [];
}

async function writeOrders(
  supabase: SupabaseClient,
  rows: { id: number; sort_order: number }[],
) {
  const now = new Date().toISOString();
  for (const row of rows) {
    const { error } = await supabase
      .from('committee_members')
      .update({ sort_order: row.sort_order, updated_at: now })
      .eq('id', row.id);

    if (error) {
      throw new Error(error.message);
    }
  }
}

/**
 * Suggest insert position for a role: after the last member in the same
 * role band; if none, at the start of that band (after earlier bands).
 */
export function suggestSortOrderForRole(
  members: OrderRow[],
  role: string,
): number {
  const band = roleBand(role);
  const sameBand = members.filter((m) => roleBand(m.role) === band);

  if (sameBand.length > 0) {
    return Math.max(...sameBand.map((m) => m.sort_order)) + 1;
  }

  const earlier = members.filter((m) => roleBand(m.role) < band);
  if (earlier.length > 0) {
    return Math.max(...earlier.map((m) => m.sort_order)) + 1;
  }

  return 1;
}

/** Insert at `targetOrder`, shifting existing members at/after that slot down. */
export async function insertAtSortOrder(
  supabase: SupabaseClient,
  committeeSlug: AdminCommitteeSlug,
  targetOrder: number,
): Promise<number> {
  const members = await listOrderedMembers(supabase, committeeSlug);
  const order = Math.max(1, targetOrder);

  const updates = members
    .filter((m) => m.sort_order >= order)
    .map((m) => ({ id: m.id, sort_order: m.sort_order + 1 }));

  await writeOrders(supabase, updates);
  return order;
}

/**
 * Move a member within (or into) a committee to `targetOrder`,
 * shifting siblings so numbers stay contiguous and unique.
 */
export async function moveToSortOrder(
  supabase: SupabaseClient,
  committeeSlug: AdminCommitteeSlug,
  memberId: number,
  targetOrder: number,
  previousCommitteeSlug: AdminCommitteeSlug,
): Promise<number> {
  const order = Math.max(1, targetOrder);

  // Leaving another committee: compact the old list first.
  if (previousCommitteeSlug !== committeeSlug) {
    await compactAfterRemoval(supabase, previousCommitteeSlug, memberId);
  }

  const members = (await listOrderedMembers(supabase, committeeSlug)).filter(
    (m) => m.id !== memberId,
  );

  const clamped = Math.min(order, members.length + 1);
  const next = [
    ...members.slice(0, clamped - 1),
    { id: memberId, role: null, sort_order: clamped },
    ...members.slice(clamped - 1),
  ].map((m, index) => ({ id: m.id, sort_order: index + 1 }));

  await writeOrders(supabase, next);
  return clamped;
}

/** Delete is separate; re-number everyone after the removed slot. */
export async function compactAfterRemoval(
  supabase: SupabaseClient,
  committeeSlug: AdminCommitteeSlug,
  removedId: number,
) {
  const members = (await listOrderedMembers(supabase, committeeSlug)).filter(
    (m) => m.id !== removedId,
  );

  const next = members.map((m, index) => ({
    id: m.id,
    sort_order: index + 1,
  }));

  await writeOrders(supabase, next);
}

export async function resolveCreateSortOrder(
  supabase: SupabaseClient,
  committeeSlug: AdminCommitteeSlug,
  role: string,
  requestedOrder: number | null,
): Promise<number> {
  const members = await listOrderedMembers(supabase, committeeSlug);

  if (requestedOrder != null && requestedOrder > 0) {
    return insertAtSortOrder(supabase, committeeSlug, requestedOrder);
  }

  const suggested = suggestSortOrderForRole(members, role);
  return insertAtSortOrder(supabase, committeeSlug, suggested);
}
