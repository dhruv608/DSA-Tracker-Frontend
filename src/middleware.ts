import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isSuperAdminRoute = pathname.startsWith('/superadmin') && pathname !== '/superadmin/login';

  if (!isAdminRoute && !isSuperAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    if (isAdminRoute) return NextResponse.redirect(new URL('/admin/login', request.url));
    if (isSuperAdminRoute) return NextResponse.redirect(new URL('/superadmin/login', request.url));
  }

  const payload = decodeJwt(token as string);

  if (!payload) {
    if (isAdminRoute) return NextResponse.redirect(new URL('/admin/login', request.url));
    if (isSuperAdminRoute) return NextResponse.redirect(new URL('/superadmin/login', request.url));
  }

  const role = payload.role;

  if (isSuperAdminRoute && role !== 'SUPERADMIN') {
    return NextResponse.redirect(new URL('/superadmin/login', request.url));
  }

  if (isAdminRoute && !['TEACHER', 'SUPERADMIN','ADMIN'].includes(role)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/superadmin/:path*'],
};
