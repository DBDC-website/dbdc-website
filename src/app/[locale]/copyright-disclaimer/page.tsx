import type { Metadata } from 'next';
import LegalPageContent from '@/components/legal/LegalPageContent';
import { copyrightDisclaimerContent } from '@/constants/legal';

export const metadata: Metadata = {
  title: copyrightDisclaimerContent.title,
};

export default function CopyrightDisclaimerPage() {
  return (
    <LegalPageContent
      title={copyrightDisclaimerContent.title}
      body={copyrightDisclaimerContent.body}
    />
  );
}
