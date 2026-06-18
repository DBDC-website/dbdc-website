import type { Metadata } from 'next';
import LegalPageContent from '@/components/legal/LegalPageContent';
import { picsPageContent } from '@/constants/legal';

export const metadata: Metadata = {
  title: picsPageContent.title,
};

export default function PicsPage() {
  return (
    <LegalPageContent
      title={picsPageContent.title}
      body={picsPageContent.body}
    />
  );
}
