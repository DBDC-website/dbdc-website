'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cinematicEase } from '@/lib/motion';
import { cn } from '@/lib/cn';
import type { ParishGuidelinesContent } from '@/types/parishGuidelines';

type ParishGuidelinesTipsProps = {
  content: Pick<
    ParishGuidelinesContent,
    'tipsTitle' | 'tips' | 'assistTitle' | 'assistBody' | 'signOff'
  >;
};

/**
 * Clock-style positions for 5 tips.
 * Tip 1 at top (12 o’clock), then evenly around the circle.
 */
function clockPosition(index: number, radius = 38) {
  const angleDeg = -90 + index * (360 / 5);
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: 50 + radius * Math.cos(angleRad),
    y: 50 + radius * Math.sin(angleRad),
    delay: index * 0.28,
  };
}

function truncateTip(text: string, max = 58) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max).replace(/\s+\S*$/, '');
  return `${cut}...`;
}

function TipOval({
  index,
  text,
  reduceMotion,
}: {
  index: number;
  text: string;
  reduceMotion: boolean | null;
}) {
  const layout = clockPosition(index);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn('absolute', hovered ? 'z-30' : 'z-10')}
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-expanded={hovered}
        aria-label={`Tip ${index + 1}`}
        className="relative flex cursor-default items-center justify-center overflow-hidden rounded-[50%] border border-sky-200/80 text-left shadow-lg shadow-brand-900/15 outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        initial={false}
        animate={
          reduceMotion
            ? {
                x: 0,
                y: 0,
                rotate: 0,
                width: hovered ? 280 : 168,
                height: hovered ? 220 : 118,
              }
            : hovered
              ? {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  width: 292,
                  height: 232,
                  scale: 1.02,
                }
              : {
                  x: [0, 7, -5, 4, 0],
                  y: [0, -9, 6, -4, 0],
                  rotate: [0, 1.8, -1.5, 1, 0],
                  width: 168,
                  height: 118,
                  scale: 1,
                }
        }
        transition={
          hovered || reduceMotion
            ? { duration: 0.4, ease: cinematicEase }
            : {
                duration: 7.2 + index * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: layout.delay,
                width: { duration: 0.4, ease: cinematicEase },
                height: { duration: 0.4, ease: cinematicEase },
                scale: { duration: 0.35, ease: cinematicEase },
              }
        }
      >
        <span
          className="absolute inset-0 bg-gradient-to-br from-[#e8f6fc] via-[#fff8eb] to-[#fde8d4]"
          aria-hidden="true"
        />
        <span
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_25%,rgba(0,160,220,0.22),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(232,140,55,0.2),transparent_50%)]"
          aria-hidden="true"
        />
        <span className="absolute inset-0 bg-white/30" aria-hidden="true" />
        <span
          className={cn(
            'relative px-4 text-center font-medium leading-snug text-brand-950',
            hovered
              ? 'max-h-[12rem] overflow-y-auto text-xs sm:text-sm'
              : 'line-clamp-4 text-[11px] sm:text-xs',
          )}
        >
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-gold-700">
            Tip {index + 1}
          </span>
          {hovered ? text : truncateTip(text)}
        </span>
      </motion.div>
    </div>
  );
}

export default function ParishGuidelinesTips({ content }: ParishGuidelinesTipsProps) {
  const reduceMotion = useReducedMotion();
  const tips = content.tips.slice(0, 5);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Full-width tips heading over both columns, left-aligned inside cylinder glow */}
      <div className="relative w-full max-w-5xl py-2 sm:py-3">
        <div
          className="pointer-events-none absolute -inset-x-2 -inset-y-1 rounded-full bg-[radial-gradient(ellipse_at_18%_45%,rgba(255,252,245,0.92)_0%,rgba(255,248,235,0.52)_40%,transparent_72%)] sm:-inset-x-4"
          aria-hidden="true"
        />
        <h2
          id="contractor-tips-heading"
          className="relative font-serif text-xl font-semibold leading-snug text-brand-950 [text-shadow:0_0_16px_rgba(255,255,255,0.95),0_0_32px_rgba(255,252,245,0.8)] sm:text-2xl lg:text-3xl"
        >
          {content.tipsTitle}
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
        <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
          {tips.map((tip, index) => (
            <TipOval
              key={tip.text}
              index={index}
              text={tip.text}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <section
          id="assist-heading"
          aria-labelledby="assist-heading-title"
          className="relative overflow-hidden rounded-[1.75rem] border border-sky-200/70 px-5 py-6 shadow-sm shadow-brand-900/10 sm:px-7 sm:py-8"
        >
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e8f6fc]/90 via-[#fff8eb]/86 to-[#fde8d4]/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(0,160,220,0.18),transparent_55%)]" />
          </div>
          <div className="relative">
            <h3
              id="assist-heading-title"
              className="font-serif text-xl font-semibold text-brand-950 sm:text-2xl"
            >
              {content.assistTitle}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-brand-900 sm:text-base">
              {content.assistBody}
            </p>
            <p className="mt-5 font-medium text-brand-950 sm:text-lg">
              {content.signOff}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
