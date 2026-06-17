import type { Metadata } from 'next';
import PageHeader from '@/components/ui/PageHeader';
import Section from '@/components/ui/Section';
import ArticleExplorer from '@/components/articles/ArticleExplorer';
import { articleCategories, articles } from '@/constants/articles';

export const metadata: Metadata = {
  title: 'Related Articles',
  description:
    'News, guidance, and stories from the Diocesan Building and Development Commission.',
};

export default function ArticlesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Related Articles"
        description="News, guidance, and stories on diocesan building, heritage, and development. Placeholder content for now."
      />
      <Section>
        <ArticleExplorer articles={articles} categories={articleCategories} />
      </Section>
    </>
  );
}
