import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ParishFlowcharts from '@/components/parish-school/ParishFlowcharts';
import ParishGuidelinesTips from '@/components/parish-school/ParishGuidelinesTips';
import Container from '@/components/ui/Container';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { parishGuidelines } from '@/constants/parishGuidelines';
import { homeImages } from '@/constants/homeImages';
import { locales, type Locale } from '@/constants/i18n';

type GuidelinesPageProps = {
  params: Promise<{ locale: string }>;
};

const pageBackdrop = homeImages.committeeDetail;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Parish Working Guidelines',
  description:
    'Useful tips for selecting contractors for parish maintenance works, and reference flow charts for maintenance, emergency, and renovation projects.',
};

export default async function ParishGuidelinesPage({ params }: GuidelinesPageProps) {
  const { locale } = await params;

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
        <div className="absolute inset-0 bg-brand-950/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/35 via-brand-950/25 to-brand-950/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,252,245,0.12),transparent_55%)]" />
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
              Parish Working Guidelines
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-relaxed text-brand-900 [text-shadow:0_0_14px_rgba(255,255,255,0.9),0_0_28px_rgba(255,252,245,0.7)] sm:text-lg lg:text-xl">
              Practical guidance on contractor selection and project workflows for
              parish building works.
            </p>
            <div
              className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-gold-400 via-[#00a0dc]/70 to-transparent"
              aria-hidden="true"
            />
          </Container>
        </header>

        <AnimatedSection
          containerSize="wide"
          spacing="compact"
          withBackground={false}
          overlayClassName="bg-transparent"
          className="!py-7 sm:!py-9 lg:!py-10"
        >
          <Link
            href={`/${locale as Locale}/parish-school`}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/55 px-3 py-1.5 text-sm font-medium text-brand-950 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/75"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Parish & School Corner
          </Link>

          <ParishGuidelinesTips content={parishGuidelines} />
        </AnimatedSection>

        <AnimatedSection
          containerSize="wide"
          spacing="compact"
          withBackground={false}
          overlayClassName="bg-transparent"
          className="!pb-12 !pt-4 sm:!pb-14 sm:!pt-6"
          aria-labelledby="flowcharts-heading"
        >
          <div className="relative mb-6 w-fit max-w-3xl py-2 sm:mb-8 sm:py-3">
            <div
              className="pointer-events-none absolute -inset-y-2 -left-3 -right-10 rounded-full bg-[radial-gradient(ellipse_at_18%_45%,rgba(255,252,245,0.92)_0%,rgba(255,248,235,0.55)_48%,transparent_78%)] sm:-left-5 sm:-right-14"
              aria-hidden="true"
            />
            <h2
              id="flowcharts-heading"
              className="relative scroll-mt-28 font-serif text-3xl font-semibold text-brand-950 [text-shadow:0_0_16px_rgba(255,255,255,0.95),0_0_32px_rgba(255,252,245,0.8)] sm:scroll-mt-32 sm:text-4xl"
            >
              {parishGuidelines.flowchartsTitle}
            </h2>
          </div>

          <ParishFlowcharts flowcharts={parishGuidelines.flowcharts} />
        </AnimatedSection>
      </div>
    </div>
  );
}
