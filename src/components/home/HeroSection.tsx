import HeroParallaxBackground from '@/components/home/HeroParallaxBackground';
import HeroContent from '@/components/home/HeroContent';
import type { Locale } from '@/constants/i18n';

type HeroSectionProps = {
  locale: Locale;
};

export default function HeroSection({ locale }: HeroSectionProps) {
  return (
    <section
      className="relative isolate overflow-hidden bg-brand-900"
      aria-labelledby="hero-heading"
    >
      <HeroParallaxBackground />
      <HeroContent locale={locale} />
    </section>
  );
}
