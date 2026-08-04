import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import HeadingGlow from '@/components/ui/HeadingGlow';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/motion/ScrollReveal';
import AboutMeetBackdrop from '@/components/home/AboutMeetBackdrop';
import CollapsibleMembershipSection from '@/components/home/CollapsibleMembershipSection';
import {
  administrator as fallbackAdministrator,
  fallbackAppointedMembers,
  memberGroups,
  type MemberGroup,
} from '@/constants/about';
import { getCommittees } from '@/content/committees';
import type { Locale } from '@/constants/i18n';
import { getCommitteeMembers, groupDbdcMembers } from '@/lib/committees';
import { localizeRoleTitle, t, tList } from '@/lib/i18n';

type AboutSectionProps = {
  locale: Locale;
};

const ROLE_CHIP =
  'inline-flex w-fit rounded-md border border-sky-200/75 bg-gradient-to-r from-[#d7f1fb] via-[#fff4df] to-[#fde0c4] px-2 py-0.5 font-serif text-[0.7rem] font-semibold uppercase leading-snug tracking-[0.06em] text-brand-900 sm:text-xs';

function ObjectivesList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
      {items.map((item) => (
        <li key={item} className="flex gap-3.5 sm:gap-4">
          <span
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-100 to-[#fde8d4] text-gold-700 ring-1 ring-gold-200/80 sm:mt-0.5 sm:h-9 sm:w-9"
            aria-hidden="true"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="text-lg font-medium leading-relaxed text-brand-950 sm:text-xl">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SubsectionHeading({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <HeadingGlow>
      <h3
        id={id}
        className="text-2xl font-semibold text-brand-950 sm:text-3xl"
      >
        {children}
      </h3>
    </HeadingGlow>
  );
}

function RoleBlock({
  title,
  members,
}: {
  title: string;
  members: string[];
}) {
  if (members.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <h4 className={ROLE_CHIP}>{title}</h4>
      <ul className="space-y-1 pl-0.5">
        {members.map((member) => (
          <li
            key={member}
            className="text-sm leading-snug text-stone-700 sm:text-[0.9375rem]"
          >
            {member}
          </li>
        ))}
      </ul>
    </div>
  );
}

function findGroup(
  groups: MemberGroup[],
  englishTitle: string,
): MemberGroup | undefined {
  return groups.find(
    (group) =>
      group.title === englishTitle ||
      group.title.toLowerCase() === englishTitle.toLowerCase(),
  );
}

export default async function AboutSection({ locale }: AboutSectionProps) {
  const [members, committees] = await Promise.all([
    getCommitteeMembers('dbdc', locale),
    Promise.resolve(getCommittees(locale)),
  ]);
  const fromDb = groupDbdcMembers(members);

  const rawLeadership =
    fromDb.leadershipGroups.length > 0
      ? fromDb.leadershipGroups
      : memberGroups;

  const exOfficio = findGroup(rawLeadership, 'Ex-officio Members');
  const chairperson = findGroup(rawLeadership, 'Chairperson');
  const viceChairperson = findGroup(rawLeadership, 'Vice-Chairperson');

  const appointedMembers =
    fromDb.appointedMembers.length > 0
      ? fromDb.appointedMembers
      : fallbackAppointedMembers;
  const administrator =
    fromDb.administrator ??
    (members.length === 0 ? fallbackAdministrator : null);

  return (
    <AnimatedSection
      id="about"
      tone="default"
      spacing="generous"
      aria-labelledby="about-dbdc-heading"
      withBackground={false}
      backdrop={<AboutMeetBackdrop />}
      overlayClassName="bg-transparent"
      className="z-[1] -mt-14 !pt-28 sm:-mt-20 sm:!pt-36 lg:-mt-28 lg:!pt-44"
    >
      <div
        className="relative z-10 rounded-[2rem] px-5 py-8 sm:rounded-[2.25rem] sm:px-7 sm:py-10 lg:px-9"
        style={{
          background:
            'radial-gradient(ellipse at 14% 18%, rgba(0,160,220,0.28) 0%, transparent 52%), radial-gradient(ellipse at 88% 16%, rgba(210,167,60,0.34) 0%, transparent 48%), radial-gradient(ellipse at 72% 88%, rgba(232,140,55,0.26) 0%, transparent 52%), radial-gradient(ellipse at 24% 90%, rgba(0,160,220,0.18) 0%, transparent 48%), linear-gradient(145deg, rgba(232,246,252,0.82) 0%, rgba(255,248,235,0.78) 42%, rgba(253,232,212,0.8) 100%)',
          boxShadow:
            '0 22px 48px rgba(40, 90, 120, 0.12), inset 0 1px 0 rgba(255, 252, 245, 0.45)',
        }}
      >
        <ScrollReveal>
          <SectionHeading
            id="about-dbdc-heading"
            title={t(locale, 'home.aboutTitle')}
            glow
            className="[&_h2]:text-4xl [&_h2]:font-semibold [&_h2]:text-brand-950 [&_h2]:[text-shadow:0_0_20px_rgba(255,255,255,1),0_0_42px_rgba(255,252,245,0.95),0_0_72px_rgba(255,248,235,0.85)] [&_h2]:sm:text-5xl"
          />
        </ScrollReveal>

        <div className="mt-4 space-y-8 sm:mt-5 lg:space-y-10">
          <p className="max-w-4xl text-base font-medium leading-relaxed text-brand-950 sm:text-lg">
            {t(locale, 'home.aboutIntro')}
          </p>

          <div className="max-w-4xl">
            <SubsectionHeading>{t(locale, 'home.objectives')}</SubsectionHeading>
            <ObjectivesList items={tList(locale, 'home.objectivesList')} />
          </div>

          {/* Membership + Committees — same About box */}
          <div
            id="about-people"
            className="scroll-mt-28 border-t border-brand-900/10 pt-6 sm:scroll-mt-32 sm:pt-7"
          >
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-14">
              <ScrollReveal>
                <div
                  id="about-membership-heading"
                  className="scroll-mt-28 sm:scroll-mt-32"
                >
                  <CollapsibleMembershipSection
                    title={t(locale, 'home.membershipTitle')}
                    intro={t(locale, 'home.membersIntro')}
                    expandLabel={t(locale, 'home.membersExpand')}
                  >
                    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                      <div className="space-y-4">
                        <RoleBlock
                          title={localizeRoleTitle(locale, 'Ex-officio Members')}
                          members={exOfficio?.members ?? []}
                        />
                        <RoleBlock
                          title={localizeRoleTitle(locale, 'Chairperson')}
                          members={chairperson?.members ?? []}
                        />
                        <RoleBlock
                          title={localizeRoleTitle(
                            locale,
                            'Vice-Chairperson',
                          )}
                          members={viceChairperson?.members ?? []}
                        />
                        {administrator ? (
                          <RoleBlock
                            title={localizeRoleTitle(locale, 'Administrator')}
                            members={[administrator]}
                          />
                        ) : null}
                      </div>

                      <div>
                        <RoleBlock
                          title={localizeRoleTitle(locale, 'Members')}
                          members={appointedMembers}
                        />
                      </div>
                    </div>
                  </CollapsibleMembershipSection>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <SubsectionHeading id="about-committees-heading">
                  {t(locale, 'home.committeesTitle')}
                </SubsectionHeading>

                <ul className="mt-6 space-y-3 sm:mt-8">
                  {committees.map((committee) => (
                    <li key={committee.slug}>
                      <Link
                        href={`/${locale}/committees/${committee.slug}`}
                        className="group flex items-start justify-between gap-3 rounded-xl border border-sky-200/60 bg-white/55 px-3.5 py-3 text-brand-950 shadow-sm transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-gold-300/80 hover:bg-white/80"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold leading-snug sm:text-base">
                            {committee.name}
                          </span>
                          <span className="mt-0.5 block text-xs font-medium text-stone-500">
                            {committee.abbreviation}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#0a6f96] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-700"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
