import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'Permissions-Policy', value: 'geolocation=()' },
  { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  {
    key: 'Content-Security-Policy',
    value: `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' static.cloudflareinsights.com;
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    img-src * blob: data:;
    connect-src 'self' *.ankr.com *.publicnode.com *.drpc.org 1rpc.io *.binance.org *.trongrid.io *.tronstack.io *.aptoslabs.com cloudflareinsights.com;
    font-src 'self' fonts.googleapis.com fonts.gstatic.com;
    frame-src 'self';
    object-src 'none';
    manifest-src 'self';
    worker-src 'self' blob:;
    upgrade-insecure-requests;
    `
      .replace(/\s{2,}/g, ' ')
      .trim(),
  },
];

const nextConfig: NextConfig = {
  headers() {
    return [{ headers: securityHeaders, source: '/(.*)' }];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.worldlibertyfinancial.com',
      },
    ],
  },

  poweredByHeader: false,

  reactStrictMode: true,
};

export default nextConfig;
