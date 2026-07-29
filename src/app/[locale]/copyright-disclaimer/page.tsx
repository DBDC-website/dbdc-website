import type { Metadata } from 'next';
import LegalPageContent from '@/components/legal/LegalPageContent';
import { copyrightDisclaimerContent } from '@/constants/legal';

export const metadata: Metadata = {
  title: copyrightDisclaimerContent.title,
  description: copyrightDisclaimerContent.description,
};

export default function CopyrightDisclaimerPage() {
  return <LegalPageContent content={copyrightDisclaimerContent} />;
}
