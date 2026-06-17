import type { Metadata } from 'next';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import { faqItems, governmentLinks } from '@/constants/parishSchool';

export const metadata: Metadata = {
  title: 'Parish & School Corner',
  description:
    'Information for parishes and schools, including frequently asked questions and useful government department links.',
};

export default function ParishSchoolPage() {
  return (
    <>
      <PageHeader
        eyebrow="For Parishes & Schools"
        title="Parish & School Corner"
        description="Guidance for parishes and schools, including frequently asked questions and useful external references."
      />

      <Section aria-labelledby="faq-heading">
        <SectionHeading
          id="faq-heading"
          eyebrow="Help"
          title="Frequently asked questions"
        />
        <div className="mt-8 max-w-3xl space-y-3">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-stone-200 bg-white p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-brand-900">
                {item.question}
                <span
                  className="text-stone-400 transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <Section tone="muted" aria-labelledby="gov-links-heading">
        <SectionHeading
          id="gov-links-heading"
          eyebrow="References"
          title="Useful government department links"
          description="Placeholder links for now — final URLs will be provided by the DBDC Office."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {governmentLinks.map((link) => (
            <Card as="li" key={link.name} interactive>
              <a
                href={link.href}
                className="flex items-center justify-between gap-3 p-5 font-medium text-brand-800"
              >
                {link.name}
                <ExternalLinkIcon
                  className="h-4 w-4 shrink-0 text-stone-400"
                  aria-hidden="true"
                />
              </a>
            </Card>
          ))}
        </ul>
      </Section>
    </>
  );
}
