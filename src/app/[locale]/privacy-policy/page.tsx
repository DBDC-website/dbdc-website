import type { Metadata } from 'next';
import LegalPageContent from '@/components/legal/LegalPageContent';
import { privacyPolicyContent } from '@/constants/legal';

export const metadata: Metadata = {
  title: privacyPolicyContent.title,
  description: privacyPolicyContent.description,
};

export default function PrivacyPolicyPage() {
  return <LegalPageContent content={privacyPolicyContent} />;
}
