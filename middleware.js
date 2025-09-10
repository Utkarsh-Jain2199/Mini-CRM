import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth.js';

export function middleware(request) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
