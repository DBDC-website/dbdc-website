import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import type { ParishGuidelinesContent } from '@/types/parishGuidelines';

type ParishGuidelinesTipsProps = {
  content: Pick<
    ParishGuidelinesContent,
    'tipsTitle' | 'tips' | 'assistTitle' | 'assistBody' | 'signOff'
  >;
};

export default function ParishGuidelinesTips({ content }: ParishGuidelinesTipsProps) {
  return (
    <div className="max-w-4xl space-y-12">
      <section aria-labelledby="contractor-tips-heading">
        <h2
          id="contractor-tips-heading"
          className="font-serif text-2xl font-semibold leading-snug text-brand-900 sm:text-3xl"
        >
          {content.tipsTitle}
        </h2>

        <StaggerChildren as="ol" className="mt-8 space-y-4">
          {content.tips.map((tip, index) => (
            <StaggerItem key={tip.text} as="li">
              <article className="flex gap-4 rounded-2xl border border-cream-200/90 bg-white/85 p-5 shadow-sm shadow-brand-900/[0.03] sm:gap-5 sm:p-6">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-sm font-semibold text-gold-800"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-stone-700 sm:text-base">
                  {tip.text}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      <section
        aria-labelledby="assist-heading"
        className="rounded-2xl border border-brand-200/50 bg-gradient-to-br from-white via-cream-50 to-brand-50/40 p-6 shadow-sm shadow-brand-900/[0.05] sm:p-8"
      >
        <h2
          id="assist-heading"
          className="font-serif text-xl font-semibold text-brand-900 sm:text-2xl"
        >
          {content.assistTitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-stone-700 sm:text-base">
          {content.assistBody}
        </p>
        <p className="mt-6 font-medium text-brand-900 sm:text-lg">{content.signOff}</p>
      </section>
    </div>
  );
}
