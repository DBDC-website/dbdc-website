import type { Metadata } from 'next';
import ArticlePdfList from '@/components/articles/ArticlePdfList';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import { homeImages } from '@/constants/homeImages';
import { getArticles } from '@/lib/articles';

/** Fetch fresh article metadata on each request (Supabase is the source of truth). */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Related Articles',
  description:
    'Research articles and papers on Diocesan building, laity involvement, and church development.',
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="relative bg-[#eef6f5]">
      <PageHeader
        eyebrow="Research"
        title="Related Articles"
        description="Published papers and research on Catholic church building and laity involvement in Hong Kong."
        theme="cathedral"
        align="center"
        contentClassName="min-h-[21rem] py-14 sm:min-h-[25rem] sm:py-16 lg:min-h-[29rem] lg:pb-10 lg:pt-20"
        backgroundImage={{
          src: homeImages.articlesHeader.src,
          alt: homeImages.articlesHeader.alt,
          objectPosition: homeImages.articlesHeader.objectPosition,
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
              Articles will appear here once published.
            </p>
          )}
        </PageSection>
      </div>
    </div>
  );
}
