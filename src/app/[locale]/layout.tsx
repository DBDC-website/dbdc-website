import { notFound } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { isValidLocale, locales, type Locale } from '@/constants/i18n';

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
      <Header locale={locale as Locale} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
