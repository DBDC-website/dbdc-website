'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/constants/admin';

function getSiteOrigin(headerList: Headers) {
  const origin = headerList.get('origin');
  if (origin) return origin;

  const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
  const proto = headerList.get('x-forwarded-proto') ?? 'http';
  if (host) return `${proto}://${host}`;

  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
}

export type MagicLinkResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function sendAdminMagicLink(
  emailRaw: string,
): Promise<MagicLinkResult> {
  const email = emailRaw.trim().toLowerCase();

  if (!email || !email.includes('@')) {
    return { ok: false, message: 'Enter a valid email address.' };
  }

  // Reject non-allowlisted emails before sending a link.
  if (!isAdminEmail(email)) {
    return {
      ok: false,
      message: 'This email is not authorised for admin access.',
    };
  }

  const headerList = await headers();
  const origin = getSiteOrigin(headerList);
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/admin/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error('Magic link send failed:', error);
    return {
      ok: false,
      message: 'Could not send the magic link. Please try again.',
    };
  }

  return {
    ok: true,
    message: 'Check your inbox for the magic link to continue.',
  };
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
