import { NextRequest, NextResponse } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  let languages: string[] | undefined;
  try {
    languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);
  } catch (error) {
    // Handle cases where Negotiator might fail (e.g., invalid headers)
    console.warn("Error negotiating languages:", error);
    languages = [i18n.defaultLocale];
  }
  
  return matchLocale(languages || [i18n.defaultLocale], locales, i18n.defaultLocale);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow direct access to sitemap.xml, robots.txt, and public assets
  if (
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/images/') || // Assuming your images are in /public/images
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // Generally, files with extensions
  ) {
    return NextResponse.next();
  }
  
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    if (locale === i18n.defaultLocale) {
      // Rewrite for default locale to keep URL clean (e.g., / instead of /fr/)
      // but serve content from /fr
      return NextResponse.rewrite(
        new URL(`/${locale}${pathname}`, request.url)
      );
    }
    // Redirect to the path with the detected locale prefix for non-default locales
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  // If locale is present, but it's the default locale, and URL isn't just /fr, redirect to cleaner URL
  // Example: /fr/somepage -> /somepage (which then gets rewritten to /fr/somepage)
  // This is to ensure canonical URLs are preferred.
  // However, for this project structure, we are consistently using /fr/ and /pt/.
  // The default locale rewrite handles the root path.

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip internal paths and specific files
    '/((?!api|_next/static|_next/image|favicon.ico|images|sitemap.xml|robots.txt).*)',
  ],
};
