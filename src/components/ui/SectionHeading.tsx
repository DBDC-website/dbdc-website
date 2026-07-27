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
  className,
}: SectionHeadingProps) {
  const Heading = as;
  const isInverse = tone === 'inverse';

  return (
    <div
      className={cn(
        align === 'center' && 'mx-auto max-w-2xl text-center',
        className,
      )}
    >
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
          'mt-3 text-3xl font-semibold leading-tight sm:text-4xl',
          id && 'scroll-mt-28 sm:scroll-mt-32 lg:scroll-mt-36',
          isInverse && 'text-white',
        )}
      >
        {title}
      </Heading>
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
