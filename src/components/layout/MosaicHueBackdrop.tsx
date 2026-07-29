import { cn } from '@/lib/cn';

type MosaicHueBackdropProps = {
  className?: string;
  /**
   * `light` — header / floating controls.
   * `dark` — page sections that should echo the same mosaic hues on a sanctuary base.
   */
  variant?: 'light' | 'dark';
};

/**
 * Soft blue / gold / warm-orange atmosphere inspired by the baptismal mosaic,
 * without stretching a photo (keeps surfaces crisp).
 */
export default function MosaicHueBackdrop({
  className,
  variant = 'light',
}: MosaicHueBackdropProps) {
  if (variant === 'dark') {
    return (
      <div
        className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
        aria-hidden="true"
      >
        {/* Near-black sanctuary base with sapphire + amber bands (indoor-2 palette) */}
        <div className="absolute inset-0 bg-[#03070c]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#041526] via-[#050a10] to-[#1a0e06]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_12%,rgba(18,72,140,0.55),transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_18%,rgba(196,120,28,0.38),transparent_48%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_88%,rgba(150,58,12,0.32),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_95%,rgba(12,48,96,0.4),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,transparent_28%,transparent_72%,rgba(0,0,0,0.45)_100%)]" />
      </div>
    );
  }

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8f6fc] via-[#fff8eb] to-[#fde8d4]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_20%,rgba(0,160,220,0.22),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_15%,rgba(210,167,60,0.28),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_95%,rgba(232,140,55,0.2),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_100%,rgba(0,160,220,0.12),transparent_45%)]" />
      <div className="absolute inset-0 bg-white/35" />
    </div>
  );
}
