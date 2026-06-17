import { redirect } from 'next/navigation';

type RedirectProps = {
  params: Promise<{ locale: string }>;
};

/** Old route name. Superseded by /consultants-contractors. */
export default async function ConsultantsRedirect({ params }: RedirectProps) {
  const { locale } = await params;
  redirect(`/${locale}/consultants-contractors`);
}
