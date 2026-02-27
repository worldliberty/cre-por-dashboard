import { type MiddlewareConfig, NextResponse } from 'next/server';

const appendSecurityHeaders = (response: NextResponse) => {
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload',
  );
};

export function proxy() {
  const response = NextResponse.next();

  appendSecurityHeaders(response);

  return response;
}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|favicon-16x16.png|favicon-32x32.png|favicon-96x96.png|favicon-180x180.png|favicon-300x300.png|favicon-512x512.png|apple-touch-icon.png|android-chrome-192x192.png|android-chrome-512x512.png|manifest.json|images|robots.txt).*)',
  ],
};
