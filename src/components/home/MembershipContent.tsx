'use client';

import ScrollReveal from '@/components/motion/ScrollReveal';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import type { MemberGroup } from '@/constants/about';
import type { Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/cn';

type MembershipContentProps = {
  locale: Locale;
  leadershipGroups: MemberGroup[];
  appointedMembers: string[];
  administrator: string | null;
};

/** Same blue → cream → warm-orange gradient family as the site header. */
const HEADER_HUE_CARD =
  'border-sky-200/70 bg-gradient-to-br from-[#e8f6fc] via-[#fff8eb] to-[#fde8d4] shadow-sm shadow-brand-900/[0.05]';
const HEADER_HUE_CHIP =
  'border-sky-200/75 bg-gradient-to-r from-[#d7f1fb] via-[#fff4df] to-[#fde0c4]';

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
        'inline-flex w-fit rounded-md border px-2.5 py-1 font-serif text-xs font-semibold uppercase leading-snug tracking-[0.06em] text-brand-900 shadow-sm sm:text-sm',
        HEADER_HUE_CHIP,
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
        'text-sm leading-snug text-stone-700 transition-colors duration-200 hover:text-brand-900',
        className,
      )}
    >
      {name}
    </span>
  );
}

function LeadershipCard({ group }: { group: MemberGroup }) {
  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-2xl border px-4 py-3.5 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-md sm:px-5 sm:py-4',
        HEADER_HUE_CARD,
      )}
    >
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

function AppointedMembersPanel({
  locale,
  members,
}: {
  locale: Locale;
  members: string[];
}) {
  if (members.length === 0) return null;

  return (
    <ScrollReveal>
      <article
        className={cn(
          'mt-6 rounded-2xl border px-4 py-3.5 sm:mt-8 sm:px-5 sm:py-4',
          HEADER_HUE_CARD,
        )}
      >
        <CategoryHeading>{t(locale, 'home.roleMembers')}</CategoryHeading>
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

function AdministratorPanel({
  locale,
  name,
}: {
  locale: Locale;
  name: string | null;
}) {
  if (!name) return null;

  return (
    <ScrollReveal delay={0.06} className="mt-4 sm:mt-5">
      <article
        className={cn(
          'rounded-2xl border px-5 py-4 sm:px-6 sm:py-5',
          HEADER_HUE_CARD,
        )}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <CategoryHeading>{t(locale, 'home.roleAdministrator')}</CategoryHeading>
          <MemberName name={name} className="pr-1 sm:pr-2 sm:text-right" />
        </div>
      </article>
    </ScrollReveal>
  );
}

export default function MembershipContent({
  locale,
  leadershipGroups,
  appointedMembers,
  administrator,
}: MembershipContentProps) {
  return (
    <div className="mt-8 pb-3 lg:mt-10 lg:pb-4">
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

      <AppointedMembersPanel locale={locale} members={appointedMembers} />
      <AdministratorPanel locale={locale} name={administrator} />
    </div>
  );
}
