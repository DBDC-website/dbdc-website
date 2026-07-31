import { notFound } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LocaleDocument from '@/components/layout/LocaleDocument';
import MobileMenuOverlay, {
  MOBILE_MENU_TOGGLE_ID,
} from '@/components/layout/MobileMenuOverlay';
import SkipLink from '@/components/layout/SkipLink';
import FloatingDonateButton from '@/components/layout/FloatingDonateButton';
import { isValidLocale, locales, type Locale } from '@/constants/i18n';
import { getMainNav } from '@/lib/i18n/navigation';

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
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const navItems = getMainNav(locale);

  return (
    <>
      <LocaleDocument locale={locale} />
      <input
        type="checkbox"
        id={MOBILE_MENU_TOGGLE_ID}
        className="peer sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      <SkipLink locale={locale} />
      <Header locale={locale} items={navItems} />
      <MobileMenuOverlay locale={locale} items={navItems} />
      <main
        id="main-content"
        className="flex-1 pt-[4.75rem] sm:pt-[5.25rem] lg:pt-[5.75rem]"
      >
        {children}
      </main>
      <FloatingDonateButton locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
