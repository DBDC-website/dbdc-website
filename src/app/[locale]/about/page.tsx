import { redirect } from 'next/navigation';

type AboutRedirectProps = {
  params: Promise<{ locale: string }>;
};

/** About content lives on homepage; keep this route as a compatibility redirect. */
export default async function AboutRedirect({ params }: AboutRedirectProps) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
