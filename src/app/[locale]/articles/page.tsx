import type { Metadata } from 'next';
import ArticlePdfList from '@/components/articles/ArticlePdfList';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import { articlePdfs } from '@/constants/articles';

export const metadata: Metadata = {
  title: 'Related Articles',
  description:
    'Research articles and papers on diocesan building, laity involvement, and church development.',
};

export default function ArticlesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Related Articles"
        description="Published papers and research on Catholic church building and laity involvement in Hong Kong."
      />
      <PageSection>
        <ArticlePdfList articles={articlePdfs} />
      </PageSection>
    </>
  );
}
