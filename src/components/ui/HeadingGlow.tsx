import { cn } from '@/lib/cn';

type HeadingGlowProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Shift the heading + cylinder right so the glow clears the section box edge
   * while staying aligned with body copy below when those stay flush.
   */
  offset?: 'default' | 'none';
};

/**
 * Soft cream “cylinder” glow behind section / subsection titles.
 * Used across homepage panels and PageSection headings for visual symmetry.
 */
export default function HeadingGlow({
  children,
  className,
  offset = 'default',
}: HeadingGlowProps) {
  return (
    <div
      className={cn(
        'relative w-fit max-w-full',
        offset === 'default' && 'ml-3 sm:ml-4',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -inset-x-4 -inset-y-5 rounded-full bg-[radial-gradient(ellipse_at_20%_40%,rgba(255,252,245,0.9)_0%,rgba(255,248,235,0.52)_40%,transparent_72%)] sm:-inset-x-7 sm:-inset-y-6"
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
