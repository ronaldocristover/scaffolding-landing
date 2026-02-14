import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Remove any locale prefix from the pathname
  const pathname = request.nextUrl.pathname;

  // If the path starts with /zh or /en, redirect to root
  if (pathname.startsWith('/zh') || pathname.startsWith('/en')) {
    const newPathname = pathname.replace(/^\/(zh|en)(\/|$)/, '/');
    url.pathname = newPathname || '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
