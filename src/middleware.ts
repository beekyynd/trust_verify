
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticatedCookie = request.cookies.get('isAuthenticated');
  const { pathname } = request.nextUrl;

  const isAuthenticated = isAuthenticatedCookie?.value === 'true';

  // If trying to access a protected route and not authenticated
  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // Add redirect query param
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access login/register, redirect to dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
     * - assets (public assets folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
