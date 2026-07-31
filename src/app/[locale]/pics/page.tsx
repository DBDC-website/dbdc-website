import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalPageContent from '@/components/legal/LegalPageContent';
import { getPics } from '@/content/legal';
import { isValidLocale, type Locale } from '@/constants/i18n';
import { buildAlternates } from '@/lib/i18n/metadata';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  const content = getPics(localeParam);
  return {
    title: content.title,
    description: content.description,
    alternates: buildAlternates(localeParam, '/pics'),
  };
}

export default async function PicsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;
  return <LegalPageContent content={getPics(locale)} />;
}
