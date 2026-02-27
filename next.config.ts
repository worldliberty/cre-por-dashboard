import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.worldlibertyfinancial.com',
      },
    ],
  },
};

export default nextConfig;
