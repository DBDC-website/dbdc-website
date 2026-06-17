import Image from 'next/image';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { aboutDbdc } from '@/constants/about';

export default function OrganizationSection() {
  return (
    <Section id="organization" tone="muted" aria-labelledby="organization-heading">
      <SectionHeading
        id="organization-heading"
        eyebrow="Structure"
        title="Organization"
      />

      <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-stone-700">
        {aboutDbdc.organization.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold text-brand-900">
          Organization structure
        </h3>
        <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl border border-stone-200 bg-white">
          <Image
            src="/images/organization-chart.png"
            alt="DBDC organization structure: the Commission, its three committees, the CaBPAG advisory group, and the DBDC Office."
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 1152px"
          />
        </div>
      </div>
    </Section>
  );
}
