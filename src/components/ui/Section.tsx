import { cn } from '@/lib/cn';
import Container from './Container';

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  /** Background treatment. */
  tone?: 'default' | 'muted' | 'brand' | 'cream' | 'sage';
  /** Vertical rhythm. */
  spacing?: 'default' | 'compact' | 'generous';
  containerSize?: 'default' | 'narrow' | 'wide';
  /** Render without the inner Container (caller controls layout). */
  bleed?: boolean;
  as?: 'section' | 'div';
  'aria-labelledby'?: string;
  id?: string;
};

const toneMap: Record<NonNullable<SectionProps['tone']>, string> = {
  default: 'bg-cream-50 text-stone-800',
  cream: 'bg-cream-100 text-stone-800',
  sage: 'bg-sage-50 text-stone-800',
  muted: 'bg-cream-100/70 text-stone-800',
  brand: 'bg-brand-900 text-stone-100',
};

const spacingMap: Record<NonNullable<SectionProps['spacing']>, string> = {
  default: 'py-16 sm:py-20 lg:py-24',
  compact: 'py-10 sm:py-12',
  generous: 'py-20 sm:py-28 lg:py-36',
};

export default function Section({
  children,
  className,
  tone = 'default',
  spacing = 'default',
  containerSize = 'default',
  bleed = false,
  as = 'section',
  id,
  ...rest
}: SectionProps) {
  const Tag = as;
  return (
    <Tag id={id} className={cn(toneMap[tone], spacingMap[spacing], className)} {...rest}>
      {bleed ? children : <Container size={containerSize}>{children}</Container>}
    </Tag>
  );
}
