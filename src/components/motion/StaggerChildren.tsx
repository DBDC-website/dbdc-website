'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/motion';
import { cn } from '@/lib/cn';

type StaggerChildrenProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'ul' | 'ol';
};

const motionTags = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
} as const;

export function StaggerChildren({
  children,
  className,
  as = 'div',
}: StaggerChildrenProps) {
  const reduceMotion = useReducedMotion();
  const Tag = as;

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motionTags[as];

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 'some', margin: '-40px' }}
      variants={staggerContainerVariants}
    >
      {children}
    </MotionTag>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li';
};

const itemTags = {
  div: motion.div,
  li: motion.li,
} as const;

export function StaggerItem({ children, className, as = 'div' }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();
  const Tag = as;

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = itemTags[as];

  return (
    <MotionTag className={cn(className)} variants={fadeUpVariants}>
      {children}
    </MotionTag>
  );
}
