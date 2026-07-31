import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/motion/ScrollReveal';
import AboutMeetBackdrop from '@/components/home/AboutMeetBackdrop';
import OrganizationChartFlow from '@/components/home/OrganizationChartFlow';
import type { Locale } from '@/constants/i18n';
import { t, tList } from '@/lib/i18n';

type AboutSectionProps = {
  locale: Locale;
};

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
      {items.map((item, index) => (
        <li key={item} className="flex gap-4">
          <span
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm font-semibold text-gold-800"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <span className="text-lg font-medium leading-relaxed text-brand-950 sm:text-xl">
            {item}
          </span>
        </li>
      ))}
    </ol>
  );
}

function SubsectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-2xl font-semibold text-brand-950 sm:text-3xl">
      {children}
    </h3>
  );
}

export default function AboutSection({ locale }: AboutSectionProps) {
  return (
    <AnimatedSection
      id="about"
      tone="default"
      spacing="generous"
      aria-labelledby="about-dbdc-heading"
      withBackground={false}
      backdrop={<AboutMeetBackdrop />}
      overlayClassName="bg-transparent"
    >
      <div
        className="relative z-10 px-5 py-8 sm:px-7 sm:py-10 lg:px-9"
        style={{
          borderRadius: '3.25rem 1.75rem 3.5rem 2.25rem / 2.75rem 3rem 2rem 3.4rem',
          background:
            'radial-gradient(ellipse at 14% 18%, rgba(0,160,220,0.28) 0%, transparent 52%), radial-gradient(ellipse at 88% 16%, rgba(210,167,60,0.34) 0%, transparent 48%), radial-gradient(ellipse at 72% 88%, rgba(232,140,55,0.26) 0%, transparent 52%), radial-gradient(ellipse at 24% 90%, rgba(0,160,220,0.18) 0%, transparent 48%), linear-gradient(145deg, rgba(232,246,252,0.82) 0%, rgba(255,248,235,0.78) 42%, rgba(253,232,212,0.8) 100%)',
          boxShadow:
            '0 22px 48px rgba(40, 90, 120, 0.12), inset 0 1px 0 rgba(255, 252, 245, 0.45)',
        }}
      >
        <ScrollReveal>
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-x-4 -inset-y-6 rounded-full bg-[radial-gradient(ellipse_at_20%_40%,rgba(255,252,245,0.85)_0%,rgba(255,248,235,0.45)_40%,transparent_70%)] sm:-inset-x-8"
              aria-hidden="true"
            />
            <SectionHeading
              id="about-dbdc-heading"
              title={t(locale, 'home.aboutTitle')}
              className="relative [&_h2]:text-4xl [&_h2]:font-semibold [&_h2]:text-brand-950 [&_h2]:[text-shadow:0_0_20px_rgba(255,255,255,1),0_0_42px_rgba(255,252,245,0.95),0_0_72px_rgba(255,248,235,0.85)] [&_h2]:sm:text-5xl"
            />
            <div
              className="relative mt-5 h-px w-20 bg-gradient-to-r from-gold-400 via-gold-300 to-transparent"
              aria-hidden="true"
            />
          </div>
        </ScrollReveal>

        <div className="mt-10 space-y-10 sm:mt-12 lg:mt-14 lg:space-y-12">
          <p className="max-w-4xl text-base font-medium leading-relaxed text-brand-950 sm:text-lg">
            {t(locale, 'home.aboutIntro')}
          </p>

          <div className="max-w-4xl">
            <SubsectionHeading>{t(locale, 'home.objectives')}</SubsectionHeading>
            <NumberedList items={tList(locale, 'home.objectivesList')} />
          </div>

          <ScrollReveal delay={0.14}>
            <div className="min-h-[28rem] sm:min-h-[32rem] lg:min-h-[40rem]">
              <OrganizationChartFlow className="size-full" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </AnimatedSection>
  );
}
