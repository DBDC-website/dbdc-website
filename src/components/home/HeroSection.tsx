import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import type { Locale } from '@/constants/i18n';
import { siteConfig } from '@/constants/site';

type HeroSectionProps = {
  locale: Locale;
};

export default function HeroSection({ locale }: HeroSectionProps) {
  return (
    <section
      className="relative isolate overflow-hidden bg-brand-900"
      aria-labelledby="hero-heading"
    >
      {/* Layered gradient reads as intentional even before a hero photo is added. */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(210,167,60,0.18),transparent_55%)]"
        aria-hidden="true"
      />

      <Container size="wide">
        <div className="flex min-h-[68vh] max-w-3xl flex-col justify-center py-20 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
            {siteConfig.tagline}
          </p>
          <h1
            id="hero-heading"
            className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            Welcome to Diocesan Building and Development Commission
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-200">
            {siteConfig.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={`/${locale}/projects`} variant="secondary" size="lg">
              Explore our projects
            </Button>
            <Button
              href={`/${locale}/committees`}
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:border-white hover:bg-white/10"
            >
              View committees
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
