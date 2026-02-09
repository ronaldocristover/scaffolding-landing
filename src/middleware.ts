import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Check for www and redirect
  const host = request.headers.get("host");
  if (host?.startsWith("www.")) {
    const newHost = host.replace("www.", "");
    const url = new URL(request.url);
    url.host = newHost;
    return NextResponse.redirect(url, { status: 301 });
  }

  // Redirect root path to default locale (zh)
  const pathname = request.nextUrl.pathname;
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/zh';
    return NextResponse.redirect(url, { status: 301 });
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public folder files
  matcher: [
    // Skip all paths that should not be internationalized
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};
