import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // 1. Define public paths (Landing, Login, Register)
    const isPublicPath = pathname === '/welcome' || pathname === '/login' || pathname === '/register';

    // 2. If authenticated and trying to access public paths (like Login), redirect to Home
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. If NOT authenticated and trying to access protected paths (Home, Search, Library), redirect to Welcome
    if (!isPublicPath && !token && pathname !== '/welcome') {
        return NextResponse.redirect(new URL('/welcome', request.url));
    }

    return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        '/',
        '/search/:path*',
        '/library/:path*',
        '/login',
        '/register',
        '/welcome',
        // Exclude api, static files, etc.
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};
