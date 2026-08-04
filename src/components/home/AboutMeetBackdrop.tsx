'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { homeImages } from '@/constants/homeImages';
import { easeOut } from '@/lib/motion';

const aboutImage = homeImages.aboutMeet;

/**
 * One photo split in half — left half slides in from the left,
 * right half from the right — meeting in the middle when About enters view.
 * Top edge fades so it blends into the hero above.
 */
export default function AboutMeetBackdrop() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.35,
    margin: '0px 0px -22% 0px',
  });

  const show = reduceMotion || isInView;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 10%, rgba(0,0,0,0.75) 22%, black 38%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 10%, rgba(0,0,0,0.75) 22%, black 38%)',
      }}
    >
      {/* Left half of the same photo */}
      <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          initial={false}
          animate={{ x: show ? '0%' : '-100%' }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 2.2, ease: easeOut }
          }
        >
          <div className="absolute inset-y-0 left-0 h-full w-[200%]">
            <Image
              src={aboutImage.src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-[0.82]"
              style={{ objectPosition: aboutImage.objectPosition }}
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Right half of the same photo */}
      <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          initial={false}
          animate={{ x: show ? '0%' : '100%' }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 2.2, ease: easeOut }
          }
        >
          <div className="absolute inset-y-0 right-0 h-full w-[200%]">
            <Image
              src={aboutImage.src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-[0.82]"
              style={{ objectPosition: aboutImage.objectPosition }}
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Soft wash at the seam so the hero and About photos meet gently */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cream-50/18 via-cream-50/6 to-transparent sm:h-36 lg:h-44" />
    </div>
  );
}
