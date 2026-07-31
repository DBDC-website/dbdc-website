import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalPageContent from '@/components/legal/LegalPageContent';
import { getCopyrightDisclaimer } from '@/content/legal';
import { isValidLocale, type Locale } from '@/constants/i18n';
import { buildAlternates } from '@/lib/i18n/metadata';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  const content = getCopyrightDisclaimer(localeParam);
  return {
    title: content.title,
    description: content.description,
    alternates: buildAlternates(localeParam, '/copyright-disclaimer'),
  };
}

export default async function CopyrightDisclaimerPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;
  return <LegalPageContent content={getCopyrightDisclaimer(locale)} />;
}
