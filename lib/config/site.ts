const CDN_HOST = 'static.worldlibertyfinancial.com';
const cdnUrl = `https://${CDN_HOST}`;
const ogImage = `${cdnUrl}/images/open-graph/por.jpg`;

export const siteConfig = {
  name: 'USD1',
  title: 'USD1 - Live Proof of Reserves',
  description:
    'Monitor USD1 reserves, total supplied, and collateralization ratio. Built for transparency with Chainlink oracle sourcing and verifiable on-chain contract data.',
  url: 'https://por.worldlibertyfinancial.com',
  cdn: cdnUrl,
  applicationName: 'USD1 Proof of Reserves',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: [
    'USD1',
    'proof of reserves',
    'stablecoin',
    'World Liberty Financial',
    'Chainlink',
    'Ethereum',
  ],
  authors: [
    {
      name: 'World Liberty Financial',
      url: 'https://worldlibertyfinancial.com',
    },
  ],
  openGraph: {
    type: 'website' as const,
    locale: 'en_US',
    url: 'https://por.worldlibertyfinancial.com',
    siteName: 'USD1 Proof of Reserves',
    title: 'USD1 Proof of Reserves - Live Reserves, Supply & Ratio',
    description:
      'Monitor USD1 reserves, total supplied, and collateralization ratio. Built for transparency with Chainlink oracle sourcing and verifiable on-chain contract data.',
    countryName: 'United States',
    images: {
      url: ogImage,
      alt: 'USD1 - Live Proof of Reserves',
      width: 1200,
      height: 630,
      type: 'image/jpeg',
    },
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'USD1 - Live Proof of Reserves',
    description:
      'Real-time Proof of Reserves dashboard for USD1 stablecoin, sourced directly from Ethereum blockchain via Chainlink.',
    site: '@worldlibertyfi',
    images: [ogImage],
  },
  links: {
    wlf: 'https://worldlibertyfinancial.com',
  },
};
