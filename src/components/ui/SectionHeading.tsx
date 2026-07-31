import HeadingGlow from '@/components/ui/HeadingGlow';
import { cn } from '@/lib/cn';

type SectionHeadingProps = {
  /** Small label above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Required for aria-labelledby wiring on the parent section. */
  id?: string;
  align?: 'left' | 'center';
  /** Heading level for correct document outline. */
  as?: 'h1' | 'h2' | 'h3';
  tone?: 'default' | 'inverse';
  /** Soft cream cylinder glow behind the title (subsection style). */
  glow?: boolean;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = 'left',
  as = 'h2',
  tone = 'default',
  glow = false,
  className,
}: SectionHeadingProps) {
  const Heading = as;
  const isInverse = tone === 'inverse';

  const titleBlock = (
    <>
      {eyebrow ? (
        <p
          className={cn(
            'text-xs font-semibold uppercase tracking-[0.18em]',
            isInverse ? 'text-gold-300' : 'text-gold-600',
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        className={cn(
          'text-3xl font-semibold leading-tight sm:text-4xl',
          eyebrow ? 'mt-3' : 'mt-0',
          id && 'scroll-mt-28 sm:scroll-mt-32 lg:scroll-mt-36',
          isInverse && 'text-white',
        )}
      >
        {title}
      </Heading>
    </>
  );

  return (
    <div
      className={cn(
        align === 'center' && 'mx-auto max-w-2xl text-center',
        className,
      )}
    >
      {glow ? (
        <HeadingGlow
          className={align === 'center' ? 'mx-auto' : undefined}
          offset={align === 'center' ? 'none' : 'default'}
        >
          {titleBlock}
        </HeadingGlow>
      ) : (
        titleBlock
      )}
      {description ? (
        <p
          className={cn(
            'mt-4 text-base leading-relaxed',
            isInverse ? 'text-stone-300' : 'text-stone-600',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
