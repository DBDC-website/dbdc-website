import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommitteeSectionAccordion from '@/components/committees/CommitteeSectionAccordion';
import PastWorkSection from '@/components/committees/PastWorkSection';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import ScrollReveal from '@/components/motion/ScrollReveal';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import { getCommittee, getCommittees } from '@/content/committees';
import { homeImages } from '@/constants/homeImages';
import { isValidLocale, locales, type Locale } from '@/constants/i18n';
import {
  getCommitteeMembers,
  withMembersSection,
} from '@/lib/committees';
import { t } from '@/lib/i18n';
import { buildAlternates } from '@/lib/i18n/metadata';
import { getCommitteePastWork } from '@/lib/pastWork';
import type { CommitteeSlug } from '@/types/committee';
import type { PastWorkCommitteeSlug } from '@/types/pastWork';

type CommitteeDetailProps = {
  params: Promise<{ locale: string; committee: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getCommittees('en').map((committee) => ({
      locale,
      committee: committee.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: CommitteeDetailProps): Promise<Metadata> {
  const { locale: localeParam, committee } = await params;
  if (!isValidLocale(localeParam)) {
    return { title: t('en', 'committees.notFound') };
  }
  const found = getCommittee(committee as CommitteeSlug, localeParam);
  if (!found) {
    return { title: t(localeParam, 'committees.notFound') };
  }
  return {
    title: found.name,
    description: t(localeParam, 'committees.metaDescription', {
      name: found.name,
    }),
    alternates: buildAlternates(localeParam, `/committees/${found.slug}`),
  };
}

export default async function CommitteeDetailPage({
  params,
}: CommitteeDetailProps) {
  const { locale: localeParam, committee } = await params;
  if (!isValidLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;
  const found = getCommittee(committee as CommitteeSlug, locale);

  if (!found) {
    notFound();
  }

  const members = await getCommitteeMembers(found.slug, locale);
  const sections = withMembersSection(found.sections, members, locale);
  const pastWork = await getCommitteePastWork(
    found.slug as PastWorkCommitteeSlug,
    locale,
  );
  const committees = getCommittees(locale);
  const currentIndex = committees.findIndex((item) => item.slug === found.slug);
  const nextCommittee =
    currentIndex >= 0 ? committees[currentIndex + 1] : undefined;

  return (
    <div className="relative bg-[#eef6fb]">
      <PageHeader
        title={found.name}
        description={found.summary}
        theme="sky"
        align="center"
        contentClassName="min-h-[18rem] py-14 sm:min-h-[22rem] sm:py-16 lg:min-h-[26rem] lg:pb-12 lg:pt-20"
        backgroundImage={{
          src: homeImages.committeeDetail.src,
          alt: homeImages.committeeDetail.alt,
          objectPosition: homeImages.committeeDetail.objectPosition,
        }}
      />

      <div className="relative isolate">
        <MosaicHueBackdrop variant="sky" />

        <PageSection
          withBackground={false}
          overlayClassName="bg-transparent"
          spacing="compact"
          className="relative z-10 !py-7 sm:!py-9 lg:!py-10"
        >
          <ScrollReveal>
            <Link
              href={`/${locale}#about-people`}
              scroll={false}
              className="inline-flex rounded-full border border-sky-200/70 bg-white/75 px-3 py-1.5 text-sm font-medium text-brand-950 shadow-sm transition-colors hover:bg-white"
            >
              {t(locale, 'committees.back')}
            </Link>
          </ScrollReveal>

          <div className="mt-5 sm:mt-6">
            <CommitteeSectionAccordion sections={sections} />
          </div>

          {pastWork.length > 0 ? (
            <PastWorkSection
              title={t(locale, 'committees.pastWork')}
              timelineLabel={t(locale, 'committees.pastWorkTimeline')}
              linkLabel={t(locale, 'committees.pastWorkLink')}
              years={pastWork}
            />
          ) : null}

          {nextCommittee ? (
            <div className="mt-6 flex justify-end sm:mt-8">
              <Link
                href={`/${locale}/committees/${nextCommittee.slug}`}
                className="inline-flex rounded-full border border-sky-200/70 bg-white/75 px-3 py-1.5 text-sm font-medium text-brand-950 shadow-sm transition-colors hover:bg-white"
              >
                {t(locale, 'committees.next', {
                  abbr: nextCommittee.abbreviation,
                })}
              </Link>
            </div>
          ) : null}
        </PageSection>
      </div>
    </div>
  );
}
