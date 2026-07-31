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
  /** Soft cream cylinder behind subsection titles. Defaults on. */
  headingGlow?: boolean;
  ruleClassName?: string;
  contentClassName?: string;
  contentDelay?: number;
  className?: string;
  tone?: 'default' | 'muted' | 'brand' | 'cream' | 'sage';
  spacing?: 'default' | 'compact' | 'generous';
  containerSize?: 'default' | 'narrow' | 'wide';
  bleed?: boolean;
  withBackground?: boolean;
  /** Overrides the default cream tone wash on AnimatedSection. */
  overlayClassName?: string;
  overflowVisible?: boolean;
  /** Pop the heading (and content) in when the section enters view. */
  animateReveal?: boolean;
  as?: 'section' | 'div';
  'aria-labelledby'?: string;
  id?: string;
};

export default function PageSection({
  children,
  heading,
  headingClassName,
  headingGlow = true,
  ruleClassName,
  contentClassName,
  contentDelay = 0.08,
  className,
  spacing = 'generous',
  withBackground = true,
  overlayClassName,
  overflowVisible,
  animateReveal = false,
  ...sectionProps
}: PageSectionProps) {
  return (
    <AnimatedSection
      spacing={spacing}
      className={className}
      withBackground={withBackground}
      overlayClassName={overlayClassName}
      overflowVisible={overflowVisible}
      {...sectionProps}
    >
      {heading ? (
        <ScrollReveal animate={animateReveal} variant="pop">
          <SectionHeading
            id={heading.id}
            eyebrow={heading.eyebrow}
            title={heading.title}
            description={heading.description}
            glow={headingGlow}
            className={cn('[&_h2]:text-3xl [&_h2]:sm:text-4xl', headingClassName)}
          />
          <div
            className={cn(
              'mt-5 h-px w-20 bg-gradient-to-r from-gold-400 via-gold-300 to-transparent',
              headingGlow && 'ml-3 sm:ml-4',
              ruleClassName,
            )}
            aria-hidden="true"
          />
        </ScrollReveal>
      ) : null}

      <ScrollReveal
        animate={animateReveal}
        variant="pop"
        delay={contentDelay}
        className={cn(heading ? 'mt-12 lg:mt-14' : undefined, contentClassName)}
      >
        {children}
      </ScrollReveal>
    </AnimatedSection>
  );
}
