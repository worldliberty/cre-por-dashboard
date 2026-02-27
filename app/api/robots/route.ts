import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  const baseUrl = req.nextUrl.origin.replace(/\/$/, '');

  const robotsContent = `User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
