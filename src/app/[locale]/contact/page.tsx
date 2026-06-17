import { redirect } from 'next/navigation';

type ContactRedirectProps = {
  params: Promise<{ locale: string }>;
};

/** Contact details are in the footer; keep this route as a compatibility redirect. */
export default async function ContactRedirect({ params }: ContactRedirectProps) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
