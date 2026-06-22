import ScrollReveal from '@/components/motion/ScrollReveal';
import { cn } from '@/lib/cn';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';

type PageSectionHeading = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
};

type PageSectionProps = {
  children: React.ReactNode;
  heading?: PageSectionHeading;
  headingClassName?: string;
  contentClassName?: string;
  contentDelay?: number;
  className?: string;
  tone?: 'default' | 'muted' | 'brand' | 'cream' | 'sage';
  spacing?: 'default' | 'compact' | 'generous';
  containerSize?: 'default' | 'narrow' | 'wide';
  bleed?: boolean;
  withBackground?: boolean;
  as?: 'section' | 'div';
  'aria-labelledby'?: string;
  id?: string;
};

export default function PageSection({
  children,
  heading,
  headingClassName,
  contentClassName,
  contentDelay = 0.08,
  className,
  spacing = 'generous',
  withBackground = true,
  ...sectionProps
}: PageSectionProps) {
  return (
    <AnimatedSection
      spacing={spacing}
      className={className}
      withBackground={withBackground}
      {...sectionProps}
    >
      {heading ? (
        <ScrollReveal>
          <SectionHeading
            id={heading.id}
            eyebrow={heading.eyebrow}
            title={heading.title}
            description={heading.description}
            className={cn('[&_h2]:text-3xl [&_h2]:sm:text-4xl', headingClassName)}
          />
          <div
            className="mt-5 h-px w-20 bg-gradient-to-r from-gold-400 via-gold-300 to-transparent"
            aria-hidden="true"
          />
        </ScrollReveal>
      ) : null}

      <ScrollReveal
        delay={contentDelay}
        className={cn(heading ? 'mt-12 lg:mt-14' : undefined, contentClassName)}
      >
        {children}
      </ScrollReveal>
    </AnimatedSection>
  );
}
