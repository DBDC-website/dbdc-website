import type { Locale } from '@/constants/i18n';
import { getCommittee, getCommittees } from '@/content/committees';
import {
  getCommitteeMembers,
  withMembersSection,
  withNewsletterSection,
} from '@/lib/committees';
import { t } from '@/lib/i18n';
import { getCabpagNewsletters } from '@/lib/newsletters';
import { getCommitteePastWork } from '@/lib/pastWork';
import type { CommitteeSlug } from '@/types/committee';
import type { PastWorkCommitteeSlug } from '@/types/pastWork';

export type CommitteeNavSection = {
  anchorId: string;
  title: string;
};

export type CommitteeNavItem = {
  slug: CommitteeSlug;
  abbreviation: string;
  name: string;
  sections: CommitteeNavSection[];
};

export function committeeSectionAnchor(slug: CommitteeSlug, index: number): string {
  return `${slug}-section-${index}`;
}

export const COMMITTEE_PAST_WORK_ANCHOR = 'past-work';

/** Build sidebar navigation for all committee detail pages. */
export async function buildCommitteeNavigation(
  locale: Locale,
): Promise<CommitteeNavItem[]> {
  const committees = getCommittees(locale);

  return Promise.all(
    committees.map(async (committee) => {
      let sections = withMembersSection(
        committee.sections,
        await getCommitteeMembers(committee.slug, locale),
        locale,
        { committeeSlug: committee.slug },
      );

      if (committee.slug === 'cabpag') {
        const newsletters = await getCabpagNewsletters(locale);
        sections = withNewsletterSection(sections, newsletters, locale);
      }

      const navSections: CommitteeNavSection[] = sections.map((section, index) => ({
        anchorId: committeeSectionAnchor(committee.slug, index),
        title: section.title,
      }));

      const pastWork = await getCommitteePastWork(
        committee.slug as PastWorkCommitteeSlug,
        locale,
      );
      if (pastWork.length > 0) {
        navSections.push({
          anchorId: COMMITTEE_PAST_WORK_ANCHOR,
          title: t(locale, 'committees.pastWork'),
        });
      }

      return {
        slug: committee.slug,
        abbreviation: committee.abbreviation,
        name: committee.name,
        sections: navSections,
      };
    }),
  );
}

/** Resolve sections for the active committee page (matches nav builder). */
export async function buildCommitteePageSections(
  slug: CommitteeSlug,
  locale: Locale,
) {
  const committee = getCommittee(slug, locale);
  if (!committee) return [];

  let sections = withMembersSection(
    committee.sections,
    await getCommitteeMembers(slug, locale),
    locale,
    { committeeSlug: slug },
  );

  if (slug === 'cabpag') {
    const newsletters = await getCabpagNewsletters(locale);
    sections = withNewsletterSection(sections, newsletters, locale);
  }

  return sections;
}
