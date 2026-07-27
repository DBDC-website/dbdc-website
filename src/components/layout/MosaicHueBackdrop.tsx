import { cn } from '@/lib/cn';

type MosaicHueBackdropProps = {
  className?: string;
};

/**
 * Soft blue / gold / warm-orange atmosphere inspired by the baptismal mosaic,
 * without stretching a photo (keeps header/footer crisp).
 */
export default function MosaicHueBackdrop({ className }: MosaicHueBackdropProps) {
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
