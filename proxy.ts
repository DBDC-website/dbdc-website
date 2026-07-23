import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isValidLocale } from '@/constants/i18n';
import { updateSession } from '@/lib/supabase/proxy';

const LOCALE_COOKIE = 'NEXT_LOCALE';

/**
 * Next.js 16 Proxy (formerly middleware).
 * - Skips locale redirect for /admin routes
 * - Refreshes Supabase auth cookies on /admin requests
 * - Redirects bare paths into a locale prefix for the public site
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin panel lives outside locale routing.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return updateSession(request);
  }

  const pathnameLocale = pathname.split('/')[1];
  if (isValidLocale(pathnameLocale)) {
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : defaultLocale;

  const pathnameWithoutLocale = pathname === '/' ? '' : pathname;
  request.nextUrl.pathname = `/${locale}${pathnameWithoutLocale}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
