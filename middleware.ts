import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin/orders');
  const hasAuthCookie = request.cookies.get('admin_auth')?.value === 'true';

  if (isAdminPath && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/orders/:path*'],
};