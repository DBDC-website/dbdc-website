import { defaultLocale, type Locale } from '@/constants/i18n';
import { localizeMemberRole, t } from '@/lib/i18n';
import { pickLocalized } from '@/lib/i18n/pickLocalized';
import { supabase } from '@/lib/supabaseClient';
import type {
  CommitteeDetailSection,
  CommitteeMember,
  CommitteeMemberRow,
  CommitteeMemberSlug,
} from '@/types/committee';
import type { CabpagNewsletter } from '@/types/newsletter';
import type { MemberGroup } from '@/constants/about';

const MEMBER_SELECT_LEGACY =
  'id, committee_slug, name, role, sort_order, active';

const MEMBER_SELECT = `
  ${MEMBER_SELECT_LEGACY},
  name_zh_hant,
  name_zh_hans,
  role_en,
  role_zh_hant,
  role_zh_hans
`;

/** Authored Chinese role override, if an editor set one for this script. */
function authoredChineseRole(
  row: CommitteeMemberRow,
  locale: Locale,
): string | null {
  if (locale === 'zh-Hant') {
    return row.role_zh_hant?.trim() || row.role_zh_hans?.trim() || null;
  }
  if (locale === 'zh-Hans') {
    return row.role_zh_hans?.trim() || row.role_zh_hant?.trim() || null;
  }
  return null;
}

function mapMemberRow(row: CommitteeMemberRow, locale: Locale): CommitteeMember {
  const record = row as unknown as Record<string, unknown>;
  const roleEn = row.role_en?.trim() || row.role?.trim() || null;

  return {
    id: row.id,
    committeeSlug: row.committee_slug,
    name: pickLocalized(record, 'name', locale) || row.name,
    nameZhHant: row.name_zh_hant?.trim() || null,
    nameZhHans: row.name_zh_hans?.trim() || null,
    role:
      authoredChineseRole(row, locale) ??
      localizeMemberRole(locale, roleEn) ??
      roleEn,
    roleEn,
    sortOrder: row.sort_order,
    active: row.active,
  };
}

export async function getCommitteeMembers(
  slug: CommitteeMemberSlug,
  locale: Locale = 'en',
): Promise<CommitteeMember[]> {
  const primary = await supabase
    .from('committee_members')
    .select(MEMBER_SELECT)
    .eq('committee_slug', slug)
    .eq('active', true)
    .order('sort_order', { ascending: true });

  const result =
    primary.error != null
      ? await supabase
          .from('committee_members')
          .select(MEMBER_SELECT_LEGACY)
          .eq('committee_slug', slug)
          .eq('active', true)
          .order('sort_order', { ascending: true })
      : primary;

  if (result.error) {
    console.error(`Failed to fetch committee members for ${slug}:`, result.error);
    return [];
  }

  return (
    (result.data as CommitteeMemberRow[] | null)?.map((row) =>
      mapMemberRow(row, locale),
    ) ?? []
  );
}

export function formatMemberLine(member: CommitteeMember): string {
  return member.role ? `${member.name} — ${member.role}` : member.name;
}

const PLACEHOLDER_SECTION_TITLES = new Set([
  'Current Chairman',
  'Current and Past Chairmen',
  'Membership',
]);

const QA_SECTION_TITLES = new Set(['Q & A', '常見問題', '常见问题']);

const PAST_WORK_SECTION_TITLES = new Set([
  'Past Work',
  '過往工作',
  '过往工作',
]);

const NEWSLETTER_SECTION_TITLES = new Set([
  'Newsletter',
  '通訊',
  '通讯',
]);

function membersSectionTitle(
  slug: CommitteeMemberSlug,
  locale: Locale,
): string {
  if (slug === 'cabpag') {
    return t(locale, 'committees.cabpagMembers');
  }
  return t(locale, 'committees.members');
}

/** Drop placeholder member sections and insert live Members from Supabase. */
export function withMembersSection(
  sections: CommitteeDetailSection[],
  members: CommitteeMember[],
  locale: Locale = defaultLocale,
  options?: { committeeSlug?: CommitteeMemberSlug },
): CommitteeDetailSection[] {
  const withoutPlaceholders = sections.filter(
    (section) => !PLACEHOLDER_SECTION_TITLES.has(section.title),
  );

  const membersSection: CommitteeDetailSection = {
    title: membersSectionTitle(options?.committeeSlug ?? 'rdc', locale),
    content: {
      kind: 'list',
      items:
        members.length > 0
          ? members.map(formatMemberLine)
          : [t(locale, 'committees.membersEmpty')],
    },
  };

  const qaIndex = withoutPlaceholders.findIndex((section) =>
    QA_SECTION_TITLES.has(section.title),
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

/**
 * Insert the CaBPAG Newsletter dropdown directly below Members whenever
 * Members exists; otherwise fall back to before Past Work / Q&A.
 */
export function withNewsletterSection(
  sections: CommitteeDetailSection[],
  newsletters: CabpagNewsletter[],
  locale: Locale = defaultLocale,
): CommitteeDetailSection[] {
  const withoutExisting = sections.filter(
    (section) => !NEWSLETTER_SECTION_TITLES.has(section.title),
  );

  const newsletterSection: CommitteeDetailSection = {
    title: t(locale, 'committees.newsletter'),
    collapsible: true,
    content: {
      kind: 'links',
      description: t(locale, 'committees.newsletterDescription'),
      emptyMessage: t(locale, 'committees.newsletterEmpty'),
      items: newsletters
        .filter((item) => Boolean(item.href))
        .map((item) => ({
          name: item.title,
          dateLabel: item.dateLabel,
          href: item.href,
        })),
    },
  };

  const membersIndex = withoutExisting.findIndex(
    (section) =>
      section.title === t(locale, 'committees.members') ||
      section.title === t(locale, 'committees.cabpagMembers'),
  );
  if (membersIndex >= 0) {
    return [
      ...withoutExisting.slice(0, membersIndex + 1),
      newsletterSection,
      ...withoutExisting.slice(membersIndex + 1),
    ];
  }

  const pastWorkIndex = withoutExisting.findIndex((section) =>
    PAST_WORK_SECTION_TITLES.has(section.title),
  );
  if (pastWorkIndex >= 0) {
    return [
      ...withoutExisting.slice(0, pastWorkIndex),
      newsletterSection,
      ...withoutExisting.slice(pastWorkIndex),
    ];
  }

  const qaIndex = withoutExisting.findIndex((section) =>
    QA_SECTION_TITLES.has(section.title),
  );
  if (qaIndex >= 0) {
    return [
      ...withoutExisting.slice(0, qaIndex),
      newsletterSection,
      ...withoutExisting.slice(qaIndex),
    ];
  }

  return [...withoutExisting, newsletterSection];
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
    const role = normalizeRole(member.roleEn ?? member.role);

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
