import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Section from '@/components/ui/Section';
import { committees, getCommittee } from '@/constants/committees';
import { locales, type Locale } from '@/constants/i18n';
import type { CommitteeSlug } from '@/types/committee';

type CommitteeDetailProps = {
  params: Promise<{ locale: string; committee: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    committees.map((committee) => ({ locale, committee: committee.slug })),
  );
}

export async function generateMetadata({
  params,
}: CommitteeDetailProps): Promise<Metadata> {
  const { committee } = await params;
  const found = getCommittee(committee as CommitteeSlug);
  if (!found) return { title: 'Committee not found' };
  return { title: found.name, description: found.summary };
}

export default async function CommitteeDetailPage({
  params,
}: CommitteeDetailProps) {
  const { locale, committee } = await params;
  const found = getCommittee(committee as CommitteeSlug);

  if (!found) {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow={found.abbreviation}
        title={found.name}
        description={found.summary}
      />
      <Section containerSize="narrow">
        <Link href={`/${locale as Locale}`} className="text-sm font-medium text-brand-700 hover:underline">
          Back to Home / About section
        </Link>

        <div className="mt-8 space-y-3">
          <details className="group rounded-lg border border-stone-200 bg-white p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-xl font-medium text-brand-900">
              Objectives
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-stone-700">
              {found.objectives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>

          <details className="group rounded-lg border border-stone-200 bg-white p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-xl font-medium text-brand-900">
              Current Chairmen
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-stone-700">
              {found.currentChairmen.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>

          <details className="group rounded-lg border border-stone-200 bg-white p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-xl font-medium text-brand-900">
              Past Chairmen
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-stone-700">
              {found.pastChairmen.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>

          <details className="group rounded-lg border border-stone-200 bg-white p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-xl font-medium text-brand-900">
              Past Work
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-stone-700">
              {found.pastWork.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>

          {found.currentWork ? (
            <details className="group rounded-lg border border-stone-200 bg-white p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-xl font-medium text-brand-900">
                Current Work
                <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-stone-700">
                {found.currentWork.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          ) : null}

          {found.organization ? (
            <details className="group rounded-lg border border-stone-200 bg-white p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-xl font-medium text-brand-900">
                Organization
                <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-stone-700">
                {found.organization.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          ) : null}

          {found.members ? (
            <details className="group rounded-lg border border-stone-200 bg-white p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-xl font-medium text-brand-900">
                Member
                <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-stone-700">
                {found.members.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      </Section>
    </>
  );
}
