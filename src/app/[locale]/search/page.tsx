import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import SearchResultsForm from '@/components/search/SearchResultsForm';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import { homeImages } from '@/constants/homeImages';
import { isValidLocale, type Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/i18n/metadata';
import {
  displaySearchPath,
  highlightSearchMatches,
} from '@/lib/searchHighlight';
import {
  buildFullSiteSearchIndex,
  filterSiteSearch,
} from '@/lib/siteSearch';

export const dynamic = 'force-dynamic';

type SearchPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const { q } = await searchParams;
  if (!isValidLocale(localeParam)) return {};

  const query = q?.trim() ?? '';
  if (query) {
    return buildPageMetadata({
      locale: localeParam,
      path: '/search',
      titleKey: 'search.resultsMetaTitleWithQuery',
      descriptionKey: 'search.resultsMetaDescription',
      titleParams: { query },
    });
  }

  return buildPageMetadata({
    locale: localeParam,
    path: '/search',
    titleKey: 'search.resultsMetaTitle',
    descriptionKey: 'search.resultsMetaDescription',
  });
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;
  const { q } = await searchParams;
  const query = (q ?? '').trim();

  const results =
    query.length >= 2
      ? filterSiteSearch(await buildFullSiteSearchIndex(locale), query, 50)
      : [];

  return (
    <div className="relative bg-[#eef6fb]">
      <PageHeader
        title={t(locale, 'search.resultsTitle')}
        theme="sky"
        align="left"
        contentClassName="min-h-[14rem] py-12 sm:min-h-[16rem] sm:py-14 lg:min-h-[18rem] lg:pb-10 lg:pt-16"
        backgroundImage={{
          src: homeImages.committeeDetail.src,
          alt: homeImages.committeeDetail.alt,
          objectPosition: homeImages.committeeDetail.objectPosition,
        }}
      />

      <div className="relative isolate">
        <MosaicHueBackdrop variant="sky" className="opacity-50" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/55 via-[#eef6fb]/70 to-white/80"
          aria-hidden="true"
        />

        <PageSection
          withBackground={false}
          overlayClassName="bg-transparent"
          spacing="compact"
          className="relative z-10 !pt-6 !pb-12 sm:!pt-8 sm:!pb-16"
          contentClassName="!mt-0"
        >
          <nav
            aria-label={t(locale, 'search.breadcrumbAria')}
            className="mb-5 text-sm text-stone-600"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href={`/${locale}`}
                  className="font-medium text-brand-800 hover:underline"
                >
                  {t(locale, 'search.breadcrumbHome')}
                </Link>
              </li>
              <li aria-hidden="true" className="text-stone-400">
                &gt;
              </li>
              <li className="font-medium text-brand-950">
                {t(locale, 'search.resultsTitle')}
              </li>
            </ol>
          </nav>

          <div className="rounded-2xl border border-sky-200/60 bg-white/85 p-4 shadow-sm shadow-brand-900/[0.04] sm:p-5">
            <SearchResultsForm locale={locale} initialQuery={query} />
          </div>

          <div className="mt-6 sm:mt-8">
            {query.length > 0 && query.length < 2 ? (
              <p className="text-sm text-stone-600 sm:text-base">
                {t(locale, 'search.queryTooShort')}
              </p>
            ) : null}

            {query.length >= 2 ? (
              <>
                <p className="text-sm text-stone-500">
                  {t(locale, 'search.totalResults', {
                    count: results.length,
                  })}
                </p>

                {results.length === 0 ? (
                  <p className="mt-6 text-base text-stone-600 sm:text-lg">
                    {t(locale, 'search.noResults')}
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-cream-200/90 border-t border-cream-200/90">
                    {results.map((entry) => {
                      const path = displaySearchPath(entry.href, locale);
                      const snippet = entry.snippet || entry.title;
                      return (
                        <li
                          key={`${entry.href}-${entry.title}-${entry.snippet ?? ''}`}
                          className="py-5 first:pt-4"
                        >
                          <Link
                            href={entry.href}
                            className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                          >
                            <h2 className="text-lg font-semibold text-brand-950 transition-colors group-hover:text-brand-800 sm:text-xl">
                              {highlightSearchMatches(entry.title, query)}
                            </h2>
                            <p className="mt-1 break-all text-xs text-stone-500 sm:text-sm">
                              {path}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-stone-700 sm:text-base">
                              {highlightSearchMatches(snippet, query)}
                            </p>
                            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-700">
                              {t(locale, `search.category.${entry.category}`)}
                            </p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            ) : query.length === 0 ? (
              <p className="mt-6 text-base text-stone-600 sm:text-lg">
                {t(locale, 'search.resultsEmptyPrompt')}
              </p>
            ) : null}
          </div>
        </PageSection>
      </div>
    </div>
  );
}
