import { cn } from '@/lib/cn';

type PlaceholderBoxProps = {
  /** Short label describing what will live here (e.g. "360° Virtual Tour"). */
  label: string;
  /** Optional supporting line. */
  description?: string;
  /** Aspect ratio utility class, e.g. "aspect-video". */
  aspect?: string;
  icon?: React.ReactNode;
  className?: string;
};

/**
 * A clearly-labelled placeholder for content arriving in a later sprint
 * (virtual tours, maps, embeds, forms). Communicates intent without faking data.
 */
export default function PlaceholderBox({
  label,
  description,
  aspect = 'aspect-video',
  icon,
  className,
}: PlaceholderBoxProps) {
  return (
    <div
      role="img"
      aria-label={`${label} placeholder`}
      className={cn(
        'flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gold-200/80 bg-gradient-to-br from-cream-50 via-white to-gold-50/40 p-8 text-center',
        aspect,
        className,
      )}
    >
      {icon ? <div className="mb-3 text-brand-500">{icon}</div> : null}
      <p className="font-medium text-brand-900">{label}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-stone-600">{description}</p>
      ) : null}
      <span className="mt-3 inline-flex items-center rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-medium text-gold-800">
        Coming soon
      </span>
    </div>
  );
}
