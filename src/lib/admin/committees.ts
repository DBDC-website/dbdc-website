import { createClient } from '@/lib/supabase/server';
import type {
  CommitteeMember,
  CommitteeMemberRow,
  CommitteeMemberSlug,
} from '@/types/committee';

const MEMBER_SELECT = 'id, committee_slug, name, role, sort_order, active';

function mapRow(row: CommitteeMemberRow): CommitteeMember {
  return {
    id: row.id,
    committeeSlug: row.committee_slug,
    name: row.name,
    role: row.role,
    sortOrder: row.sort_order,
    active: row.active,
  };
}

export async function listAdminCommitteeMembers(
  slug?: CommitteeMemberSlug,
): Promise<CommitteeMember[]> {
  const supabase = await createClient();
  let query = supabase
    .from('committee_members')
    .select(MEMBER_SELECT)
    .order('committee_slug', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (slug) {
    query = query.eq('committee_slug', slug);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to list committee members:', error);
    return [];
  }

  return (data as CommitteeMemberRow[] | null)?.map(mapRow) ?? [];
}

export async function getAdminCommitteeMember(
  id: number,
): Promise<CommitteeMember | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('committee_members')
    .select(MEMBER_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Failed to load committee member:', error);
    return null;
  }

  return data ? mapRow(data as CommitteeMemberRow) : null;
}
