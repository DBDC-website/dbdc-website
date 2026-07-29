'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ParishSchoolPreamble as PreambleData } from '@/types/parishSchool';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';

type ParishSchoolPreambleProps = {
  preamble: PreambleData;
};

export default function ParishSchoolPreamble({ preamble }: ParishSchoolPreambleProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const isExpanded = (label: string) => expanded[label] === true;

  const toggle = (label: string) => {
    setExpanded((current) => ({ ...current, [label]: !current[label] }));
  };

  const previewText = (text: string, max = 180) => {
    if (text.length <= max) return text;
    return `${text.slice(0, max).trimEnd()}...`;
  };

  return (
    <div className="max-w-4xl space-y-8">
      <p className="text-base leading-relaxed text-stone-700 sm:text-lg">
        {preamble.intro}
      </p>

      <div>
        <p className="font-medium text-brand-900 sm:text-lg">{preamble.leadIn}</p>

        <StaggerChildren as="ol" className="mt-6 grid gap-4 sm:grid-cols-2">
          {preamble.considerations.map((item, index) => (
            <StaggerItem key={item.label} as="li">
              <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-cream-200/90 p-5 shadow-sm shadow-brand-900/[0.03] sm:p-6">
                <MosaicHueBackdrop />
                <span className="absolute inset-0 bg-white/48" aria-hidden="true" />
                <div className="flex gap-4">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-sm font-semibold text-brand-800"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>

                  <div className="relative min-w-0 flex-1">
                    <h3 className="font-serif text-lg font-semibold text-brand-900 sm:text-xl">
                      {item.label}
                    </h3>

                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={isExpanded(item.label) ? 'expanded' : 'collapsed'}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.22 }}
                      >
                        {item.text ? (
                          <p className="mt-2 text-sm leading-relaxed text-stone-700 sm:text-base">
                            {isExpanded(item.label) ? item.text : previewText(item.text)}
                          </p>
                        ) : null}

                        {item.subItems ? (
                          isExpanded(item.label) ? (
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-stone-700 sm:text-base">
                              {item.subItems.map((subItem) => (
                                <li key={subItem}>{subItem}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-sm leading-relaxed text-stone-700 sm:text-base">
                              {previewText(item.subItems.join(' '))}
                            </p>
                          )
                        ) : null}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {(item.text || item.subItems) ? (
                  <button
                    type="button"
                    onClick={() => toggle(item.label)}
                    className="relative mt-4 self-start text-sm font-semibold text-brand-800 transition-colors hover:text-brand-950"
                  >
                    {isExpanded(item.label) ? 'Show less' : 'Read more...'}
                  </button>
                ) : null}
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </div>
  );
}
