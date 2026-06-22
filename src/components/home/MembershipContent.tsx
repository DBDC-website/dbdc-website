'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from '@/components/motion/ScrollReveal';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import Button from '@/components/ui/Button';
import {
  administrator,
  memberGroups,
  type MemberGroup,
} from '@/constants/about';
import { easeOut } from '@/lib/motion';
import { cn } from '@/lib/cn';

const leadershipGroups = memberGroups.filter(
  (group) => group.title !== 'Appointed Members',
);

const appointedMembers =
  memberGroups.find((group) => group.title === 'Appointed Members')?.members ?? [];

const APPOINTED_MEMBERS_PANEL_ID = 'appointed-members-panel';

/** Shared panel dimensions for Appointed Members and Administrator rows. */
const membershipPanelClass =
  'flex min-h-[8.75rem] flex-col rounded-2xl p-5 shadow-sm shadow-brand-900/[0.04] backdrop-blur-sm sm:min-h-[9.25rem] sm:p-6';

function CategoryHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        'font-serif text-sm font-semibold uppercase leading-snug tracking-[0.05em] text-brand-900 sm:text-base lg:text-lg',
        className,
      )}
    >
      {children}
    </h3>
  );
}

function MemberName({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        'group/name inline-block transition-transform duration-300 ease-out hover:-translate-y-0.5',
        className,
      )}
    >
      <span className="border-b border-transparent pb-0.5 text-sm text-stone-600 transition-[color,border-color] duration-300 group-hover/name:border-gold-400 group-hover/name:text-brand-900 sm:text-base">
        {name}
      </span>
    </span>
  );
}

function LeadershipCard({ group }: { group: MemberGroup }) {
  return (
    <article className="flex h-full min-h-[8.75rem] flex-col rounded-2xl border border-cream-200/90 bg-white/80 p-5 shadow-sm shadow-brand-900/[0.04] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-0.5 hover:border-brand-200/60 hover:shadow-md hover:shadow-brand-900/[0.06] sm:min-h-[9.25rem] sm:p-6">
      <CategoryHeading>{group.title}</CategoryHeading>
      <ul className="mt-4 space-y-2 sm:mt-5">
        {group.members.map((member) => (
          <li key={member}>
            <MemberName name={member} />
          </li>
        ))}
      </ul>
    </article>
  );
}

function AppointedMembersPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <article
      className={cn(
        membershipPanelClass,
        'mt-12 border border-cream-200/90 bg-white/80 sm:mt-14',
      )}
    >
      <ScrollReveal className="flex flex-1 flex-col justify-center">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <CategoryHeading>Appointed Members</CategoryHeading>
            <p className="mt-2 text-sm text-stone-500">
              {appointedMembers.length} appointed members serving the Commission
            </p>
          </div>

          <div className="shrink-0 sm:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-expanded={isOpen}
              aria-controls={APPOINTED_MEMBERS_PANEL_ID}
              onClick={() => setIsOpen((open) => !open)}
              className="w-full border-brand-200 text-brand-800 hover:border-gold-400 hover:bg-cream-50 sm:w-auto"
            >
              {isOpen ? 'Hide appointed members' : 'View all appointed members'}
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-300',
                  isOpen && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {reduceMotion ? (
        isOpen ? (
          <ul
            id={APPOINTED_MEMBERS_PANEL_ID}
            className="mt-6 grid gap-x-8 gap-y-3 border-t border-cream-200 pt-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {appointedMembers.map((member) => (
              <li key={member}>
                <MemberName name={member} />
              </li>
            ))}
          </ul>
        ) : null
      ) : (
        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              id={APPOINTED_MEMBERS_PANEL_ID}
              role="region"
              aria-label="Appointed members list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
              className="overflow-hidden"
            >
              <ul className="mt-6 grid gap-x-8 gap-y-3 border-t border-cream-200 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                {appointedMembers.map((member, index) => (
                  <motion.li
                    key={member}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.05 + index * 0.025,
                      duration: 0.35,
                      ease: easeOut,
                    }}
                  >
                    <MemberName name={member} />
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </article>
  );
}

function AdministratorPanel() {
  return (
    <ScrollReveal delay={0.08} className="mt-6 lg:mt-8">
      <article
        className={cn(
          membershipPanelClass,
          'justify-center border border-brand-200/50 bg-gradient-to-br from-white via-cream-50 to-brand-50/40 shadow-brand-900/[0.05]',
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <CategoryHeading>Administrator</CategoryHeading>
          <p className="shrink-0 sm:text-right">
            <MemberName name={administrator} />
          </p>
        </div>
      </article>
    </ScrollReveal>
  );
}

export default function MembershipContent() {
  return (
    <div className="mt-14 lg:mt-16">
      <StaggerChildren
        as="div"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
      >
        {leadershipGroups.map((group) => (
          <StaggerItem key={group.title} className="h-full">
            <LeadershipCard group={group} />
          </StaggerItem>
        ))}
      </StaggerChildren>

      <AppointedMembersPanel />
      <AdministratorPanel />
    </div>
  );
}
