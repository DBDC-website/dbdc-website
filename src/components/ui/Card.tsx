import { cn } from '@/lib/cn';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  /** Adds hover elevation/border treatment for interactive cards. */
  interactive?: boolean;
  as?: 'div' | 'article' | 'li';
};

export default function Card({
  children,
  className,
  interactive = false,
  as = 'div',
}: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'rounded-xl border border-cream-200/90 bg-white/90 shadow-sm shadow-brand-900/[0.04]',
        interactive &&
          'transition-all duration-300 hover:-translate-y-1 hover:border-gold-200/80 hover:shadow-md hover:shadow-brand-900/[0.06]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
