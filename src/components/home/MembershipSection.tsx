import Image from 'next/image';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/motion/ScrollReveal';
import MembershipContent from '@/components/home/MembershipContent';
import {
  administrator as fallbackAdministrator,
  fallbackAppointedMembers,
  memberGroups,
} from '@/constants/about';
import { homeImages } from '@/constants/homeImages';
import type { Locale } from '@/constants/i18n';
import { getCommitteeMembers, groupDbdcMembers } from '@/lib/committees';
import { localizeRoleTitle, t } from '@/lib/i18n';

const membershipBackdrop = homeImages.membership;

function MembershipBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image
        src={membershipBackdrop.src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: membershipBackdrop.objectPosition }}
        priority={false}
      />
    </div>
  );
}

type MembershipSectionProps = {
  locale: Locale;
};

export default async function MembershipSection({
  locale,
}: MembershipSectionProps) {
  const members = await getCommitteeMembers('dbdc', locale);
  const fromDb = groupDbdcMembers(members);

  const leadershipGroups = (
    fromDb.leadershipGroups.length > 0
      ? fromDb.leadershipGroups
      : memberGroups
  ).map((group) => ({
    ...group,
    title: localizeRoleTitle(locale, group.title),
  }));
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
      withBackground={false}
      backdrop={<MembershipBackdrop />}
      overlayClassName="bg-gradient-to-b from-[#fff8eb]/26 via-cream-50/16 to-[#f5efe4]/22"
    >
      <div
        className="relative z-10 rounded-[2rem] px-5 py-8 sm:rounded-[2.25rem] sm:px-7 sm:py-10 lg:px-9"
        style={{
          background:
            'radial-gradient(ellipse at 14% 18%, rgba(0,160,220,0.28) 0%, transparent 52%), radial-gradient(ellipse at 88% 16%, rgba(210,167,60,0.34) 0%, transparent 48%), radial-gradient(ellipse at 72% 88%, rgba(232,140,55,0.26) 0%, transparent 52%), radial-gradient(ellipse at 24% 90%, rgba(0,160,220,0.18) 0%, transparent 48%), linear-gradient(145deg, rgba(232,246,252,0.72) 0%, rgba(255,248,235,0.62) 42%, rgba(253,232,212,0.68) 100%)',
          boxShadow:
            '0 22px 48px rgba(40, 90, 120, 0.12), inset 0 1px 0 rgba(255, 252, 245, 0.45)',
        }}
      >
        <ScrollReveal>
          <SectionHeading
            id="membership-heading"
            title={t(locale, 'home.membershipTitle')}
            glow
            className="[&_h2]:text-4xl [&_h2]:text-brand-950 [&_h2]:[text-shadow:0_0_20px_rgba(255,255,255,1),0_0_42px_rgba(255,252,245,0.95),0_0_72px_rgba(255,248,235,0.85)] [&_h2]:sm:text-5xl"
          />
          <div
            className="relative ml-3 mt-5 h-px w-20 bg-gradient-to-r from-gold-400 via-gold-300 to-transparent sm:ml-4"
            aria-hidden="true"
          />
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-stone-700 sm:mt-6 sm:text-lg">
            {t(locale, 'home.membersIntro')}
          </p>
        </ScrollReveal>

        <MembershipContent
          locale={locale}
          leadershipGroups={leadershipGroups}
          appointedMembers={appointedMembers}
          administrator={administrator}
        />
      </div>
    </AnimatedSection>
  );
}
