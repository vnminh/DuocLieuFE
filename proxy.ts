import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Authentication Middleware
 * Protects all routes except public ones (login, signup, forgot-password)
 * Redirects unauthenticated users to login page
 */

// Public routes that don't require authentication
const publicRoutes = [
  '/account/login',
  '/account/signup',
  '/account/forgot-password',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Get auth_user cookie
  const authUserCookie = request.cookies.get('auth_user');

  // If it's a public route
  if (isPublicRoute) {
    // If user is already logged in and trying to access login/signup, redirect to admin
    if (authUserCookie?.value) {
      try {
        const user = JSON.parse(decodeURIComponent(authUserCookie.value));
        if (user && user.id) {
          return NextResponse.redirect(new URL('/admin/users', request.url));
        }
      } catch (error) {
        // Invalid cookie, let them continue to login
      }
    }
    return NextResponse.next();
  }

  // For protected routes, check if user is authenticated
  if (!authUserCookie?.value) {
    // No auth cookie, redirect to login
    const loginUrl = new URL('/account/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Validate the cookie contains valid user data
  try {
    const user = JSON.parse(decodeURIComponent(authUserCookie.value));
    if (!user || !user.id) {
      // Invalid user data, redirect to login
      const loginUrl = new URL('/account/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      // Clear the invalid cookie
      response.cookies.delete('auth_user');
      return response;
    }
  } catch (error) {
    // Invalid JSON in cookie, redirect to login
    const loginUrl = new URL('/account/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    // Clear the invalid cookie
    response.cookies.delete('auth_user');
    return response;
  }

  // User is authenticated, allow request
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     * - api routes (if any)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
