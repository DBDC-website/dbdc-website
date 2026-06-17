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
        'rounded-xl border border-stone-200 bg-white shadow-sm',
        interactive &&
          'transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
