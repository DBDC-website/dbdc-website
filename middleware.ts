import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, isValidLocale } from '@/constants/i18n';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
