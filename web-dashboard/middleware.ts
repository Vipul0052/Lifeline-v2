import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSupabaseClient } from '../shared/supabase';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for auth pages, API routes, and static files
  if (
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  try {
    const supabase = getSupabaseClient();
    
    // Get the session from the request
    const token = request.cookies.get('sb-access-token')?.value;
    
    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Verify the session
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      // Invalid session, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Valid session, allow access
    return NextResponse.next();
  } catch (error) {
    // Error verifying session, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (auth pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};