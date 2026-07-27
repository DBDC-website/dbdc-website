'use client';

import ScrollReveal from '@/components/motion/ScrollReveal';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import type { MemberGroup } from '@/constants/about';
import { cn } from '@/lib/cn';

type MembershipContentProps = {
  leadershipGroups: MemberGroup[];
  appointedMembers: string[];
  administrator: string | null;
};

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
        'font-serif text-xs font-semibold uppercase leading-snug tracking-[0.06em] text-brand-900 sm:text-sm',
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
        'text-sm leading-snug text-stone-600 transition-colors duration-200 hover:text-brand-900',
        className,
      )}
    >
      {name}
    </span>
  );
}

function LeadershipCard({ group }: { group: MemberGroup }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-cream-200/90 bg-white/80 px-4 py-3.5 shadow-sm shadow-brand-900/[0.03] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-brand-200/60 hover:shadow-md hover:shadow-brand-900/[0.05] sm:px-5 sm:py-4">
      <CategoryHeading>{group.title}</CategoryHeading>
      <ul className="mt-2.5 space-y-1.5">
        {group.members.map((member) => (
          <li key={member}>
            <MemberName name={member} />
          </li>
        ))}
      </ul>
    </article>
  );
}

function AppointedMembersPanel({ members }: { members: string[] }) {
  if (members.length === 0) return null;

  return (
    <ScrollReveal>
      <article className="mt-6 rounded-xl border border-cream-200/90 bg-white/80 px-4 py-3.5 shadow-sm shadow-brand-900/[0.03] sm:mt-8 sm:px-5 sm:py-4">
        <CategoryHeading>Appointed Members</CategoryHeading>
        <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <li key={member}>
              <MemberName name={member} />
            </li>
          ))}
        </ul>
      </article>
    </ScrollReveal>
  );
}

function AdministratorPanel({ name }: { name: string | null }) {
  if (!name) return null;

  return (
    <ScrollReveal delay={0.06} className="mt-4 sm:mt-5">
      <article className="rounded-xl border border-brand-200/50 bg-gradient-to-br from-white via-cream-50 to-brand-50/40 px-4 py-3.5 shadow-sm shadow-brand-900/[0.04] sm:px-5 sm:py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <CategoryHeading>Administrator</CategoryHeading>
          <MemberName name={name} className="sm:text-right" />
        </div>
      </article>
    </ScrollReveal>
  );
}

export default function MembershipContent({
  leadershipGroups,
  appointedMembers,
  administrator,
}: MembershipContentProps) {
  return (
    <div className="mt-8 lg:mt-10">
      {leadershipGroups.length > 0 ? (
        <StaggerChildren
          as="div"
          className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
        >
          {leadershipGroups.map((group) => (
            <StaggerItem key={group.title} className="h-full">
              <LeadershipCard group={group} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      ) : null}

      <AppointedMembersPanel members={appointedMembers} />
      <AdministratorPanel name={administrator} />
    </div>
  );
}
