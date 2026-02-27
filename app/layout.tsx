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
  title: `${siteConfig.name} | ${siteConfig.title}`,
  description: siteConfig.description,
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={fontSans.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect to Ethereum RPCs for faster first data load */}
        <link href="https://rpc.ankr.com" rel="dns-prefetch" />
        <link href="https://ethereum.publicnode.com" rel="dns-prefetch" />
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
