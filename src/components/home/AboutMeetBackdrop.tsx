'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { homeImages } from '@/constants/homeImages';
import { easeOut } from '@/lib/motion';

const [leftImage, rightImage] = homeImages.aboutMeet;

/**
 * Two photos slide in from opposite edges and meet in the middle
 * when the About section enters the viewport.
 *
 * Important: we observe a static container (not the sliding panels).
 * Panels start off-screen, so whileInView on them would never fire.
 */
export default function AboutMeetBackdrop() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.2,
    margin: '0px 0px -10% 0px',
  });

  const show = reduceMotion || isInView;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 will-change-transform"
        initial={false}
        animate={{ x: show ? '0%' : '-100%' }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.45, ease: easeOut }
        }
      >
        <Image
          src={leftImage.src}
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
          style={{ objectPosition: leftImage.objectPosition }}
          priority
        />
      </motion.div>

      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 will-change-transform"
        initial={false}
        animate={{ x: show ? '0%' : '100%' }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.45, ease: easeOut }
        }
      >
        <Image
          src={rightImage.src}
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
          style={{ objectPosition: rightImage.objectPosition }}
          priority
        />
      </motion.div>
    </div>
  );
}
