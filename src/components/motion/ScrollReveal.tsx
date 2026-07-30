'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { fadeUpVariants, popInVariants } from '@/lib/motion';
import { cn } from '@/lib/cn';

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'article';
  /**
   * When true, plays the entrance once the block enters the viewport.
   * Defaults to false so existing call sites stay static unless opted in.
   */
  animate?: boolean;
  /** `pop` adds a slight scale for a snappier entrance. */
  variant?: 'fadeUp' | 'pop';
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  as = 'div',
  animate = false,
  variant = 'fadeUp',
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const Tag = as;
  const base = variant === 'pop' ? popInVariants : fadeUpVariants;

  if (reduceMotion || !animate) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={false}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: base.hidden,
        visible: {
          ...base.visible,
          transition: {
            ...base.visible.transition,
            delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
