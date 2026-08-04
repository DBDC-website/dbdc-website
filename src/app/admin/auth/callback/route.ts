import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/constants/admin';

/**
 * One-time link / PKCE callback.
 * Supabase redirects here with ?code=... after the user clicks the email link.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=missing_code`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Auth callback exchange failed:', error);
    return NextResponse.redirect(
      `${origin}/admin/login?error=auth_exchange`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(
      `${origin}/admin/login?error=unauthorized`,
    );
  }

  return NextResponse.redirect(`${origin}/admin`);
}
