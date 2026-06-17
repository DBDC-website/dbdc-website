import { redirect } from 'next/navigation';

type RedirectProps = {
  params: Promise<{ locale: string }>;
};

/** Old route name. Superseded by /parish-school. */
export default async function PartnersRedirect({ params }: RedirectProps) {
  const { locale } = await params;
  redirect(`/${locale}/parish-school`);
}
