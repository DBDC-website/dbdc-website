import { notFound } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import MobileMenuOverlay, {
  MOBILE_MENU_TOGGLE_ID,
} from '@/components/layout/MobileMenuOverlay';
import SkipLink from '@/components/layout/SkipLink';
import FloatingDonateButton from '@/components/layout/FloatingDonateButton';
import { isValidLocale, locales, type Locale } from '@/constants/i18n';
import { mainNav } from '@/constants/site';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <>
      <input
        type="checkbox"
        id={MOBILE_MENU_TOGGLE_ID}
        className="peer sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      <SkipLink />
      <Header locale={locale as Locale} />
      <MobileMenuOverlay locale={locale as Locale} items={mainNav} />
      <main id="main-content" className="flex-1 pt-[4.75rem] sm:pt-[5.25rem] lg:pt-[5.75rem]">
        {children}
      </main>
      <FloatingDonateButton />
      <Footer locale={locale as Locale} />
    </>
  );
}
