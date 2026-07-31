import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommitteeSectionAccordion from '@/components/committees/CommitteeSectionAccordion';
import ScrollReveal from '@/components/motion/ScrollReveal';
import Container from '@/components/ui/Container';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { committees, getCommittee } from '@/constants/committees';
import { homeImages } from '@/constants/homeImages';
import { locales, type Locale } from '@/constants/i18n';
import {
  getCommitteeMembers,
  withMembersSection,
} from '@/lib/committees';
import type { CommitteeSlug } from '@/types/committee';

type CommitteeDetailProps = {
  params: Promise<{ locale: string; committee: string }>;
};

const committeeBackdrop = homeImages.committeeDetail;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    committees.map((committee) => ({ locale, committee: committee.slug })),
  );
}

export async function generateMetadata({
  params,
}: CommitteeDetailProps): Promise<Metadata> {
  const { committee } = await params;
  const found = getCommittee(committee as CommitteeSlug);
  if (!found) return { title: 'Committee not found' };
  return { title: found.name, description: found.summary };
}

export default async function CommitteeDetailPage({
  params,
}: CommitteeDetailProps) {
  const { locale, committee } = await params;
  const found = getCommittee(committee as CommitteeSlug);

  if (!found) {
    notFound();
  }

  const members = await getCommitteeMembers(found.slug);
  const sections = withMembersSection(found.sections, members);
  const currentIndex = committees.findIndex((item) => item.slug === found.slug);
  const nextCommittee = currentIndex >= 0 ? committees[currentIndex + 1] : undefined;
  const zoomBackdrop =
    found.slug === 'rdc' || found.slug === 'sc' || found.slug === 'wc';
  const backdropScaleClass =
    found.slug === 'sc'
      ? 'object-cover scale-[1.42]'
      : zoomBackdrop
        ? 'object-cover scale-[1.32]'
        : 'object-cover';

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <Image
          src={committeeBackdrop.src}
          alt=""
          fill
          sizes="100vw"
          className={backdropScaleClass}
          style={{ objectPosition: committeeBackdrop.objectPosition }}
          priority
        />
        <div className="absolute inset-0 bg-cream-50/16" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fff8eb]/14 via-cream-50/8 to-[#f0ebe3]/16" />
      </div>

      <div className="relative z-10">
        <header className="relative pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pb-12 lg:pt-36">
          {/* Navbar-hue strip behind title + summary — lowered so photo separates it from site nav */}
          <div
            className="pointer-events-none absolute inset-x-0 top-[58%] z-0 h-[min(72%,22rem)] -translate-y-1/2 sm:top-[60%] sm:h-[min(70%,24rem)]"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#e8f6fc]/92 via-[#fff8eb]/88 to-[#fde8d4]/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_20%,rgba(0,160,220,0.22),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_15%,rgba(210,167,60,0.28),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_95%,rgba(232,140,55,0.2),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_100%,rgba(0,160,220,0.12),transparent_45%)]" />
            <div className="absolute inset-0 bg-white/25" />
          </div>

          <Container size="wide" className="relative z-10 px-6 text-center sm:px-8">
            <h1 className="mx-auto max-w-4xl font-serif text-4xl font-semibold leading-tight text-brand-950 [text-shadow:0_0_18px_rgba(255,255,255,0.95),0_0_36px_rgba(255,252,245,0.75)] sm:text-5xl lg:text-6xl">
              {found.name}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-relaxed text-brand-900 [text-shadow:0_0_14px_rgba(255,255,255,0.9),0_0_28px_rgba(255,252,245,0.7)] sm:text-lg lg:text-xl">
              {found.summary}
            </p>
            <div
              className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-gold-400 via-[#00a0dc]/70 to-transparent"
              aria-hidden="true"
            />
          </Container>
        </header>

        <AnimatedSection
          containerSize="narrow"
          spacing="compact"
          withBackground={false}
          overlayClassName="bg-transparent"
          className="!py-7 sm:!py-9 lg:!py-10"
        >
          <ScrollReveal>
            <Link
              href={`/${locale as Locale}#committees`}
              scroll={false}
              className="inline-flex rounded-full border border-white/60 bg-white/55 px-3 py-1.5 text-sm font-medium text-brand-950 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/75"
            >
              ← Back to Committees
            </Link>
          </ScrollReveal>

          <div className="mt-5 sm:mt-6">
            <CommitteeSectionAccordion sections={sections} />
          </div>
          {nextCommittee ? (
            <div className="mt-6 flex justify-end sm:mt-8">
              <Link
                href={`/${locale as Locale}/committees/${nextCommittee.slug}`}
                className="inline-flex rounded-full border border-white/60 bg-white/55 px-3 py-1.5 text-sm font-medium text-brand-950 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/75"
              >
                Next: {nextCommittee.abbreviation} →
              </Link>
            </div>
          ) : null}
        </AnimatedSection>
      </div>
    </div>
  );
}
