import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticlePdfList from '@/components/articles/ArticlePdfList';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import { isValidLocale, type Locale } from '@/constants/i18n';
import { getArticles } from '@/lib/articles';
import { t } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/i18n/metadata';
import { withSupabaseImageTransform } from '@/lib/supabaseImage';

/** Fetch fresh article metadata on each request (Supabase is the source of truth). */
export const dynamic = 'force-dynamic';

type ArticlesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ArticlesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  return buildPageMetadata({
    locale: localeParam,
    path: '/articles',
    titleKey: 'articles.metaTitle',
    descriptionKey: 'articles.metaDescription',
  });
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;
  const articles = await getArticles(locale);

  return (
    <div className="relative bg-[#eef6f5]">
      <PageHeader
        eyebrow={t(locale, 'articles.eyebrow')}
        title={t(locale, 'articles.title')}
        description={t(locale, 'articles.description')}
        theme="cathedral"
        align="center"
        contentClassName="min-h-[21rem] py-14 sm:min-h-[25rem] sm:py-16 lg:min-h-[29rem] lg:pb-10 lg:pt-20"
        backgroundImage={{
          src: withSupabaseImageTransform(
            'https://cgwkyszmhbwirecaxbuq.supabase.co/storage/v1/object/public/website-assets/indoor-1.jpg',
            { width: 1200, quality: 80 },
          ),
          alt: 'Baptismal chapel with mosaic mural',
          objectPosition: 'center 72%',
        }}
      />

      <div className="relative isolate">
        <MosaicHueBackdrop className="opacity-68" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f5fffd]/72 via-[#eef6f5]/55 to-[#f6faf9]/72"
          aria-hidden="true"
        />

        <PageSection
          withBackground={false}
          overlayClassName="bg-transparent"
          spacing="compact"
          className="relative z-10 !pt-8 !pb-12 sm:!pt-10 sm:!pb-14"
          contentClassName="!mt-8 lg:!mt-10"
        >
          {articles.length > 0 ? (
            <ArticlePdfList articles={articles} />
          ) : (
            <p className="max-w-4xl text-base text-stone-600 sm:text-lg">
              {t(locale, 'articles.empty')}
            </p>
          )}
        </PageSection>
      </div>
    </div>
  );
}
