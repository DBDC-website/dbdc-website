import { cn } from '@/lib/cn';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Constrain to a narrower reading width (used for long-form text). */
  size?: 'default' | 'narrow' | 'wide';
};

const sizeMap: Record<NonNullable<ContainerProps['size']>, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
};

export default function Container({
  children,
  className,
  size = 'default',
}: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeMap[size], className)}>
      {children}
    </div>
  );
}
