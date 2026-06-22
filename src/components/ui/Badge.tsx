import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'brand' | 'gold' | 'success' | 'info';

const tones: Record<Tone, string> = {
  neutral: 'bg-stone-100 text-stone-700',
  brand: 'bg-brand-100 text-brand-800',
  gold: 'bg-gold-100 text-gold-800',
  success: 'bg-emerald-100 text-emerald-800',
  info: 'bg-sky-100 text-sky-800',
};

type BadgeProps = {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
};

export default function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
