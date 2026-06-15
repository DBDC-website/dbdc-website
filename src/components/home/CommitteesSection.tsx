import Link from 'next/link';
import { committees } from '@/constants/about';
import type { Locale } from '@/constants/i18n';

type CommitteesSectionProps = {
  locale: Locale;
};

export default function CommitteesSection({ locale }: CommitteesSectionProps) {
  return (
    <section className="border-t border-gray-200 py-16" aria-labelledby="committees-heading">
      <h2
        id="committees-heading"
        className="text-2xl font-bold text-gray-900 md:text-3xl"
      >
        Committees
      </h2>

      <ul className="mt-8 space-y-3">
        {committees.map((committee) => (
          <li key={committee.slug}>
            <Link
              href={`/${locale}/committee#${committee.slug}`}
              className="text-base font-medium text-blue-800 underline decoration-blue-800/30 underline-offset-4 transition-colors hover:text-blue-900 hover:decoration-blue-900"
            >
              {committee.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
