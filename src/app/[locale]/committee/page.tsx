import { redirect } from 'next/navigation';

type RedirectProps = {
  params: Promise<{ locale: string }>;
};

/** Old singular route. Permanently superseded by /committees. */
export default async function CommitteeRedirect({ params }: RedirectProps) {
  const { locale } = await params;
  redirect(`/${locale}/committees`);
}
