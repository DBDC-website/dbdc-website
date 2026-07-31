import Image from 'next/image';
import Link from 'next/link';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/motion/ScrollReveal';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import { getCommittees } from '@/content/committees';
import { homeImages } from '@/constants/homeImages';
import type { Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';

type CommitteesSectionProps = {
  locale: Locale;
};

const committeesBackdrop = homeImages.committees;

function CommitteesBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image
        src={committeesBackdrop.src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: committeesBackdrop.objectPosition }}
        priority={false}
      />
    </div>
  );
}

export default function CommitteesSection({ locale }: CommitteesSectionProps) {
  const committees = getCommittees(locale);

  return (
    <AnimatedSection
      id="committees"
      tone="sage"
      spacing="generous"
      aria-labelledby="committees-heading"
      withBackground={false}
      backdrop={<CommitteesBackdrop />}
      overlayClassName="bg-gradient-to-b from-cream-50/78 via-cream-50/68 to-cream-100/74"
    >
      <ScrollReveal>
        <div className="relative">
          <div
            className="pointer-events-none absolute -inset-x-4 -inset-y-3 rounded-full bg-[radial-gradient(ellipse_at_20%_40%,rgba(255,252,245,0.92)_0%,rgba(255,248,235,0.55)_40%,transparent_70%)] sm:-inset-x-8"
            aria-hidden="true"
          />
          <SectionHeading
            id="committees-heading"
            title={t(locale, 'home.committeesTitle')}
            className="relative [&_h2]:text-4xl [&_h2]:font-semibold [&_h2]:text-brand-950 [&_h2]:[text-shadow:0_0_22px_rgba(255,255,255,1),0_0_48px_rgba(255,252,245,0.98),0_0_80px_rgba(255,248,235,0.9)] [&_h2]:sm:text-5xl"
          />
        </div>
        <div className="relative mt-4 h-px w-16 bg-gold-400" aria-hidden="true" />
      </ScrollReveal>

      <StaggerChildren as="ul" className="mt-10 space-y-4">
        {committees.map((committee) => (
          <StaggerItem key={committee.slug} as="li">
            <Link
              href={`/${locale}/committees/${committee.slug}`}
              className="group inline-flex rounded-md bg-cream-50/55 px-2 py-1 text-lg font-semibold text-brand-950 underline decoration-brand-500/80 underline-offset-[6px] [text-shadow:0_0_14px_rgba(255,255,255,1),0_0_28px_rgba(255,252,245,0.9)] transition-colors hover:bg-cream-50/75 hover:text-brand-950 hover:decoration-gold-600 sm:text-xl"
            >
              {committee.name} ({committee.abbreviation})
            </Link>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </AnimatedSection>
  );
}
