import type { Metadata } from 'next';
import LegalPageContent from '@/components/legal/LegalPageContent';
import { picsPageContent } from '@/constants/legal';

export const metadata: Metadata = {
  title: picsPageContent.title,
  description: picsPageContent.description,
};

export default function PicsPage() {
  return <LegalPageContent content={picsPageContent} />;
}
