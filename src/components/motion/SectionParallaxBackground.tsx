'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { homeImages } from '@/constants/homeImages';
import { useTouchDevice } from '@/hooks/useTouchDevice';

type SectionParallaxBackgroundProps = {
  sectionRef: React.RefObject<HTMLElement | null>;
  /** Subtle image strength — keep low for readable content overlays. */
  imageOpacity?: number;
};

export default function SectionParallaxBackground({
  sectionRef,
  imageOpacity = 0.22,
}: SectionParallaxBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const isTouch = useTouchDevice();
  const simplifyMotion = Boolean(reduceMotion || isTouch);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1.12]);

  if (simplifyMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <Image
          src={homeImages.hero.src}
          alt=""
          fill
          className="object-cover"
          style={{ opacity: imageOpacity * 0.75 }}
          sizes="100vw"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Image
          src={homeImages.hero.src}
          alt=""
          fill
          className="object-cover"
          style={{ opacity: imageOpacity }}
          sizes="100vw"
          unoptimized
        />
      </motion.div>
    </div>
  );
}
