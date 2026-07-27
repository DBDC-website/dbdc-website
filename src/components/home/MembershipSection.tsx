import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/motion/ScrollReveal';
import MembershipContent from '@/components/home/MembershipContent';
import {
  aboutDbdc,
  administrator as fallbackAdministrator,
  fallbackAppointedMembers,
  memberGroups,
} from '@/constants/about';
import { getCommitteeMembers, groupDbdcMembers } from '@/lib/committees';

export default async function MembershipSection() {
  const members = await getCommitteeMembers('dbdc');
  const fromDb = groupDbdcMembers(members);

  const leadershipGroups =
    fromDb.leadershipGroups.length > 0
      ? fromDb.leadershipGroups
      : memberGroups;
  const appointedMembers =
    fromDb.appointedMembers.length > 0
      ? fromDb.appointedMembers
      : fallbackAppointedMembers;
  const administrator =
    fromDb.administrator ??
    (members.length === 0 ? fallbackAdministrator : null);

  return (
    <AnimatedSection
      id="membership"
      tone="default"
      spacing="default"
      aria-labelledby="membership-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_10%_0%,rgba(212,167,60,0.08),transparent_45%),radial-gradient(circle_at_90%_100%,rgba(143,179,154,0.1),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <ScrollReveal>
          <SectionHeading
            id="membership-heading"
            title="Membership"
            className="[&_h2]:text-4xl [&_h2]:sm:text-5xl"
          />
          <div
            className="mt-5 h-px w-20 bg-gradient-to-r from-gold-400 via-gold-300 to-transparent"
            aria-hidden="true"
          />
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-stone-700 sm:mt-6 sm:text-lg">
            {aboutDbdc.membersIntro}
          </p>
        </ScrollReveal>

        <MembershipContent
          leadershipGroups={leadershipGroups}
          appointedMembers={appointedMembers}
          administrator={administrator}
        />
      </div>
    </AnimatedSection>
  );
}
