import { redirect } from 'next/navigation';

type CommitteesRedirectProps = {
  params: Promise<{ locale: string }>;
};

/**
 * Committees are presented in the Home/About section.
 * Keep this route only as a compatibility redirect.
 */
export default async function CommitteesRedirect({
  params,
}: CommitteesRedirectProps) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
