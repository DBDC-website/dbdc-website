import { supabase } from '@/lib/supabaseClient';
import type {
  CommitteeDetailSection,
  CommitteeMember,
  CommitteeMemberRow,
  CommitteeMemberSlug,
} from '@/types/committee';
import type { MemberGroup } from '@/constants/about';

const MEMBER_SELECT = 'id, committee_slug, name, role, sort_order, active';

function mapMemberRow(row: CommitteeMemberRow): CommitteeMember {
  return {
    id: row.id,
    committeeSlug: row.committee_slug,
    name: row.name,
    role: row.role,
    sortOrder: row.sort_order,
    active: row.active,
  };
}

export async function getCommitteeMembers(
  slug: CommitteeMemberSlug,
): Promise<CommitteeMember[]> {
  const { data, error } = await supabase
    .from('committee_members')
    .select(MEMBER_SELECT)
    .eq('committee_slug', slug)
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error(`Failed to fetch committee members for ${slug}:`, error);
    return [];
  }

  return (data as CommitteeMemberRow[] | null)?.map(mapMemberRow) ?? [];
}

export function formatMemberLine(member: CommitteeMember): string {
  return member.role ? `${member.name} — ${member.role}` : member.name;
}

const PLACEHOLDER_SECTION_TITLES = new Set([
  'Current Chairman',
  'Current and Past Chairmen',
  'Membership',
]);

/** Drop placeholder member sections and insert live Members from Supabase. */
export function withMembersSection(
  sections: CommitteeDetailSection[],
  members: CommitteeMember[],
): CommitteeDetailSection[] {
  const withoutPlaceholders = sections.filter(
    (section) => !PLACEHOLDER_SECTION_TITLES.has(section.title),
  );

  const membersSection: CommitteeDetailSection = {
    title: 'Members',
    content: {
      kind: 'list',
      items:
        members.length > 0
          ? members.map(formatMemberLine)
          : ['Member list will appear here once published.'],
    },
  };

  const qaIndex = withoutPlaceholders.findIndex(
    (section) => section.title === 'Q & A',
  );

  if (qaIndex >= 0) {
    return [
      ...withoutPlaceholders.slice(0, qaIndex),
      membersSection,
      ...withoutPlaceholders.slice(qaIndex),
    ];
  }

  return [...withoutPlaceholders, membersSection];
}

function normalizeRole(role: string | null): string {
  return (role ?? '').trim().toLowerCase();
}

export type DbdcMembershipView = {
  leadershipGroups: MemberGroup[];
  appointedMembers: string[];
  administrator: string | null;
};

/** Map DBDC commission rows into the homepage membership layout. */
export function groupDbdcMembers(members: CommitteeMember[]): DbdcMembershipView {
  const exOfficio: string[] = [];
  const chairpersons: string[] = [];
  const viceChairpersons: string[] = [];
  const appointed: string[] = [];
  let administrator: string | null = null;

  for (const member of members) {
    const role = normalizeRole(member.role);

    if (role.includes('administrator')) {
      administrator = member.name;
      continue;
    }
    if (role.includes('ex-officio') || role.includes('ex officio')) {
      exOfficio.push(member.name);
      continue;
    }
    if (role === 'chairman' || role === 'chairperson' || role === 'convenor') {
      chairpersons.push(member.name);
      continue;
    }
    if (
      role === 'vice-chairman' ||
      role === 'vice-chairperson' ||
      role === 'vice chairman' ||
      role.includes('deputy')
    ) {
      viceChairpersons.push(member.name);
      continue;
    }

    appointed.push(member.name);
  }

  const leadershipGroups: MemberGroup[] = [];
  if (exOfficio.length > 0) {
    leadershipGroups.push({ title: 'Ex-officio Members', members: exOfficio });
  }
  if (chairpersons.length > 0) {
    leadershipGroups.push({ title: 'Chairperson', members: chairpersons });
  }
  if (viceChairpersons.length > 0) {
    leadershipGroups.push({
      title: 'Vice-Chairperson',
      members: viceChairpersons,
    });
  }

  return {
    leadershipGroups,
    appointedMembers: appointed,
    administrator,
  };
}
