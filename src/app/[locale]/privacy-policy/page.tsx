import type { Metadata } from 'next';
import LegalPageContent from '@/components/legal/LegalPageContent';
import { privacyPolicyContent } from '@/constants/legal';

export const metadata: Metadata = {
  title: privacyPolicyContent.title,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageContent
      title={privacyPolicyContent.title}
      body={privacyPolicyContent.body}
    />
  );
}
