import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';
import ConsultantForm from '@/components/registration/ConsultantForm';
import { isValidLocale, type Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/i18n/metadata';
import { withSupabaseImageTransform } from '@/lib/supabaseImage';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  return buildPageMetadata({
    locale: localeParam,
    path: '/consultants-contractors/consultant',
    titleKey: 'consultants.consultantMetaTitle',
    descriptionKey: 'consultants.consultantMetaDescription',
  });
}

export default async function ConsultantRegistrationPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;

  return (
    <>
      <PageHeader
        eyebrow={t(locale, 'consultants.eyebrow')}
        title={t(locale, 'consultants.consultantFormTitle')}
        description={t(locale, 'consultants.consultantBody')}
        theme="cathedral"
        align="center"
        contentClassName="min-h-[21rem] py-14 sm:min-h-[25rem] sm:py-16 lg:min-h-[29rem] lg:pb-10 lg:pt-20"
        backgroundImage={{
          src: withSupabaseImageTransform(
            'https://cgwkyszmhbwirecaxbuq.supabase.co/storage/v1/object/public/website-assets/outdoor-bridge.jpg',
            { width: 1200, quality: 80 },
          ),
          alt: 'White cross overlooking a coastal bridge',
          objectPosition: 'center 40%',
        }}
      />

      <PageSection containerSize="narrow" spacing="default">
        <Link
          href={`/${locale}/consultants-contractors`}
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition-colors hover:text-brand-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t(locale, 'consultants.formBack')}
        </Link>
        <ConsultantForm locale={locale} />
      </PageSection>
    </>
  );
}
