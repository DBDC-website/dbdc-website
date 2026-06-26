import type { ParishSchoolPreamble as PreambleData } from '@/types/parishSchool';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';

type ParishSchoolPreambleProps = {
  preamble: PreambleData;
};

export default function ParishSchoolPreamble({ preamble }: ParishSchoolPreambleProps) {
  return (
    <div className="max-w-4xl space-y-8">
      <p className="text-base leading-relaxed text-stone-700 sm:text-lg">
        {preamble.intro}
      </p>

      <div>
        <p className="font-medium text-brand-900 sm:text-lg">{preamble.leadIn}</p>

        <StaggerChildren as="ol" className="mt-6 space-y-4">
          {preamble.considerations.map((item, index) => (
            <StaggerItem key={item.label} as="li">
              <article className="rounded-2xl border border-cream-200/90 bg-white/85 p-5 shadow-sm shadow-brand-900/[0.03] sm:p-6">
                <div className="flex gap-4">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-sm font-semibold text-brand-800"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-lg font-semibold text-brand-900 sm:text-xl">
                      {item.label}
                    </h3>

                    {item.text ? (
                      <p className="mt-2 text-sm leading-relaxed text-stone-700 sm:text-base">
                        {item.text}
                      </p>
                    ) : null}

                    {item.subItems ? (
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-stone-700 sm:text-base">
                        {item.subItems.map((subItem) => (
                          <li key={subItem}>{subItem}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </div>
  );
}
