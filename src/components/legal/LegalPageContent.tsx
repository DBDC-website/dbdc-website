import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import HeadingGlow from '@/components/ui/HeadingGlow';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import { homeImages } from '@/constants/homeImages';
import type { LegalPageContentData } from '@/constants/legal';

type LegalPageContentProps = {
  content: LegalPageContentData;
};

const pageHero = homeImages.legalPage;

export default function LegalPageContent({ content }: LegalPageContentProps) {
  return (
    <div className="relative bg-[#f5f0e8]">
      <PageHeader
        title={content.title}
        description={content.description}
        theme="cathedral"
        align="center"
        contentClassName="min-h-[18rem] py-14 sm:min-h-[22rem] sm:py-16 lg:min-h-[26rem] lg:pb-12 lg:pt-20"
        backgroundImage={{
          src: pageHero.src,
          alt: pageHero.alt,
          objectPosition: pageHero.objectPosition,
        }}
      />

      <div className="relative isolate">
        <MosaicHueBackdrop className="opacity-55" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#fff8eb]/70 via-[#f5f0e8]/60 to-[#f8f4ec]/75"
          aria-hidden="true"
        />

        <PageSection
          withBackground={false}
          overlayClassName="bg-transparent"
          spacing="compact"
          className="relative z-10 !pb-14 !pt-8 sm:!pb-16 sm:!pt-10"
          contentClassName="!mt-0 max-w-3xl"
        >
          <div className="space-y-8 sm:space-y-10">
            {content.sections.map((section) => (
              <section key={section.heading} className="space-y-3 sm:space-y-4">
                <HeadingGlow>
                  <h2 className="font-serif text-xl font-semibold text-brand-950 [text-shadow:0_0_14px_rgba(255,255,255,0.95),0_0_28px_rgba(255,252,245,0.8)] sm:text-2xl">
                    {section.heading}
                  </h2>
                </HeadingGlow>

                <div className="space-y-3 rounded-2xl border border-sky-200/60 bg-gradient-to-br from-[#e8f6fc]/88 via-[#fff8eb]/84 to-[#fde8d4]/88 px-4 py-4 shadow-sm shadow-brand-900/10 sm:px-5 sm:py-5">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 64)}
                      className="text-sm leading-relaxed text-brand-950 sm:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}
