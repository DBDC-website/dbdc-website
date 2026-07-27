import HeroParallaxBackground from '@/components/home/HeroParallaxBackground';
import HeroContent from '@/components/home/HeroContent';
import type { Locale } from '@/constants/i18n';

type HeroSectionProps = {
  locale: Locale;
};

export default function HeroSection({ locale }: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden bg-brand-900"
      aria-labelledby="hero-heading"
    >
      <HeroParallaxBackground />
      <div className="relative z-10">
        <HeroContent locale={locale} />
      </div>
    </section>
  );
}
