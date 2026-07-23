import type { Metadata } from 'next';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/constants/admin';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin login',
};

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: 'This email is not authorised for admin access.',
  missing_code: 'The magic link was incomplete. Please request a new one.',
  auth_exchange: 'Could not complete sign-in. Please request a new magic link.',
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && isAdminEmail(user.email)) {
    redirect('/admin/registrations');
  }

  const { error } = await searchParams;
  const initialError = error ? ERROR_MESSAGES[error] ?? 'Sign-in failed.' : null;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-xl border border-cream-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
          Staff access
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-brand-900">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Enter your authorised email. We will send a one-time magic link — no
          password required.
        </p>
        <div className="mt-6">
          <AdminLoginForm initialError={initialError} />
        </div>
      </div>
    </div>
  );
}
