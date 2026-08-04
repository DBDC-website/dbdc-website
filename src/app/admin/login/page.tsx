import type { Metadata } from 'next';
import Link from 'next/link';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/constants/admin';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin login',
};

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: 'This email is not authorised for admin access.',
  missing_code: 'The one-time link was incomplete. Please request a new one.',
  auth_exchange:
    'Could not complete sign-in. Please request a new one-time link.',
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
    redirect('/admin');
  }

  const { error } = await searchParams;
  const initialError = error ? ERROR_MESSAGES[error] ?? 'Sign-in failed.' : null;

  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent"
      />

      <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="max-w-xl lg:-translate-y-8 lg:pr-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
            Staff access
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <h1 className="font-serif text-4xl font-bold leading-[1.15] tracking-tight text-logo-grey sm:text-5xl lg:text-[3.25rem]">
              Diocesan Building and Development Commission
            </h1>
          </Link>
          <p className="mt-5 max-w-md text-base leading-relaxed text-stone-600 sm:text-lg">
            Welcome to the admin panel. Sign in to manage website content,
            committees, and registrations.
          </p>
        </div>

        <div className="w-full max-w-md justify-self-start lg:justify-self-end">
          <div className="rounded-2xl border border-cream-200/90 bg-white/75 p-6 shadow-[0_8px_40px_rgba(27,39,64,0.08)] backdrop-blur-sm sm:p-9">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-brand-950 sm:text-3xl">
              Admin sign in
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Enter your authorised email. We will send a one-time link to your
              inbox.
            </p>
            <div className="mt-7">
              <AdminLoginForm initialError={initialError} />
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-stone-500 lg:text-right">
            Authorised staff only.
          </p>
        </div>
      </div>
    </div>
  );
}
