'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import FaqAnswerContent from '@/components/parish-school/FaqAnswerContent';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import { easeOut } from '@/lib/motion';
import { cn } from '@/lib/cn';
import type { FaqItem } from '@/types/parishSchool';

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const baseId = useId();
  const reduceMotion = useReducedMotion();
  const [openItems, setOpenItems] = useState<Set<number>>(() => new Set());

  const toggleItem = (number: number) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(number)) {
        next.delete(number);
      } else {
        next.add(number);
      }
      return next;
    });
  };

  return (
    <StaggerChildren as="div" className="max-w-4xl space-y-3">
      {items.map((item) => {
        const isOpen = openItems.has(item.number);
        const panelId = `${baseId}-faq-${item.number}`;

        return (
          <StaggerItem key={item.number}>
            <article
              className={cn(
                'overflow-hidden rounded-2xl border bg-white/90 shadow-sm shadow-brand-900/[0.03] transition-[border-color,box-shadow] duration-300',
                isOpen
                  ? 'border-gold-300/80 shadow-md shadow-brand-900/[0.06]'
                  : 'border-cream-200/90 hover:border-brand-200/70',
              )}
            >
              <button
                type="button"
                id={`${panelId}-trigger`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.number)}
                className="flex w-full cursor-pointer items-start gap-4 p-5 text-left sm:gap-5 sm:p-6"
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors duration-300',
                    isOpen
                      ? 'bg-gold-200 text-gold-900'
                      : 'bg-brand-100 text-brand-800',
                  )}
                  aria-hidden="true"
                >
                  {item.number}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-brand-900 sm:text-lg">
                    {item.question}
                  </span>
                </span>

                <ChevronDown
                  className={cn(
                    'mt-1 h-5 w-5 shrink-0 text-gold-600 transition-transform duration-300',
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>

              {reduceMotion ? (
                isOpen ? (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={`${panelId}-trigger`}
                    className="border-t border-cream-200/90 px-5 pb-5 sm:px-6 sm:pb-6"
                  >
                    <div className="pt-4 sm:pt-5">
                      <FaqAnswerContent blocks={item.answer} />
                    </div>
                  </div>
                ) : null
              ) : (
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={`${panelId}-trigger`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: easeOut }}
                      className="overflow-hidden border-t border-cream-200/90"
                    >
                      <motion.div
                        initial={{ y: -8 }}
                        animate={{ y: 0 }}
                        exit={{ y: -8 }}
                        transition={{ duration: 0.35, ease: easeOut }}
                        className="px-5 pb-5 sm:px-6 sm:pb-6"
                      >
                        <div className="pt-4 sm:pt-5">
                          <FaqAnswerContent blocks={item.answer} />
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              )}
            </article>
          </StaggerItem>
        );
      })}
    </StaggerChildren>
  );
}
