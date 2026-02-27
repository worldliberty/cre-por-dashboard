import type { Metadata, Viewport } from 'next';
import { Sora } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import type { ReactNode } from 'react';

import { ThemeProvider } from '@/components/providers/theme';
import { Web3Provider } from '@/components/providers/wagmi';
import { siteConfig } from '@/lib/config/site';

import './globals.css';

const fontSans = Sora({
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: '#000000',
  width: 'device-width',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.applicationName,
  generator: siteConfig.generator,
  authors: siteConfig.authors,
  keywords: siteConfig.keywords,
  manifest: siteConfig.manifest,
  robots: 'index, follow',
  alternates: { canonical: './' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: siteConfig.name,
  },
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    {
      rel: 'icon',
      url: '/favicon-16x16.png',
      sizes: '16x16',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/favicon-32x32.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/favicon-96x96.png',
      sizes: '96x96',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/favicon-180x180.png',
      sizes: '180x180',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/favicon-300x300.png',
      sizes: '300x300',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/favicon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
  ],
  openGraph: siteConfig.openGraph,
  twitter: siteConfig.twitter,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={fontSans.variable}
      suppressHydrationWarning
      translate="no"
    >
      <head>
        <meta content="notranslate" name="google" />

        {/* Preconnect to CDN and primary RPCs for faster first load */}
        <link href={siteConfig.cdn} rel="preconnect" />
        {/* EVM */}
        <link href="https://rpc.ankr.com" rel="dns-prefetch" />
        <link href="https://ethereum.publicnode.com" rel="dns-prefetch" />
        <link href="https://bsc-rpc.publicnode.com" rel="dns-prefetch" />
        {/* Non-EVM */}
        <link href="https://api.trongrid.io" rel="dns-prefetch" />
        <link href="https://solana-rpc.publicnode.com" rel="dns-prefetch" />
        <link href="https://api.mainnet.aptoslabs.com" rel="dns-prefetch" />
      </head>
      <body className="min-w-[340px] overflow-x-hidden bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <NextTopLoader color="var(--brand-600)" showSpinner={false} />
          <Web3Provider>{children}</Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
