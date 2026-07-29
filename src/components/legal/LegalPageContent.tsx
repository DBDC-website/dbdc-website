import Image from 'next/image';
import Container from '@/components/ui/Container';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { homeImages } from '@/constants/homeImages';
import type { LegalPageContentData } from '@/constants/legal';

type LegalPageContentProps = {
  content: LegalPageContentData;
};

const pageBackdrop = homeImages.committeeDetail;

export default function LegalPageContent({ content }: LegalPageContentProps) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <Image
          src={pageBackdrop.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: pageBackdrop.objectPosition }}
          priority
        />
      </div>

      <div className="relative z-10">
        <header className="relative pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pb-12 lg:pt-36">
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
              {content.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-relaxed text-brand-900 [text-shadow:0_0_14px_rgba(255,255,255,0.9),0_0_28px_rgba(255,252,245,0.7)] sm:text-lg">
              {content.description}
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
          className="!pb-14 !pt-6 sm:!pb-16 sm:!pt-8"
        >
          <div className="space-y-8 sm:space-y-10">
            {content.sections.map((section) => (
              <section key={section.heading} className="space-y-3 sm:space-y-4">
                <div className="relative w-fit max-w-full py-1.5 sm:py-2">
                  <div
                    className="pointer-events-none absolute -inset-y-2 -left-3 -right-8 rounded-full bg-[radial-gradient(ellipse_at_18%_45%,rgba(255,252,245,0.92)_0%,rgba(255,248,235,0.55)_48%,transparent_78%)] sm:-left-4 sm:-right-10"
                    aria-hidden="true"
                  />
                  <h2 className="relative font-serif text-xl font-semibold text-brand-950 [text-shadow:0_0_14px_rgba(255,255,255,0.95),0_0_28px_rgba(255,252,245,0.8)] sm:text-2xl">
                    {section.heading}
                  </h2>
                </div>

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
        </AnimatedSection>
      </div>
    </div>
  );
}
