import { cn } from '@/lib/cn';

type HeadingGlowProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Shift the heading + cylinder right so the glow clears the section box edge
   * while staying aligned with body copy below when those stay flush.
   */
  offset?: 'default' | 'none';
  /**
   * `box` — slightly tighter cylinder so it stays inside bordered cards
   * while keeping the title vertically centered in the glow.
   */
  fit?: 'default' | 'box';
};

/**
 * Soft cream “cylinder” glow behind section / subsection titles.
 * On hover, the cylinder warms to a soft orangish hue.
 */
export default function HeadingGlow({
  children,
  className,
  offset = 'default',
  fit = 'default',
}: HeadingGlowProps) {
  return (
    <div
      className={cn(
        'group/heading relative w-fit max-w-full',
        offset === 'default' && 'ml-3 sm:ml-4',
        className,
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute rounded-full transition-[background,opacity,filter] duration-500 ease-out',
          fit === 'box'
            ? '-inset-x-3 -inset-y-2.5 sm:-inset-x-5 sm:-inset-y-3'
            : '-inset-x-4 -inset-y-5 sm:-inset-x-7 sm:-inset-y-6',
          'bg-[radial-gradient(ellipse_at_20%_40%,rgba(255,252,245,0.9)_0%,rgba(255,248,235,0.52)_40%,transparent_72%)]',
          'group-hover/heading:bg-[radial-gradient(ellipse_at_22%_40%,rgba(255,236,210,0.95)_0%,rgba(253,220,180,0.62)_38%,rgba(255,200,140,0.22)_58%,transparent_74%)]',
          'group-hover/heading:brightness-[1.03]',
        )}
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
