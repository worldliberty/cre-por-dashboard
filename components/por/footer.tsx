import Image from 'next/image';
import Link from 'next/link';

import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/lib/config/site';

export function Footer() {
  return (
    <footer className="mt-auto">
      <Separator className="h-[1.5px] bg-transparent footer-line-gradient" />

      <div className="flex flex-col items-start gap-6 py-10 md:py-12">
        <Image
          alt="World Liberty Financial Logo"
          className="w-[240px]"
          height={20}
          loading="eager"
          src="/images/logo.svg"
          width={240}
        />
        <div className="text-xs text-foreground-quaternary">
          Accuracy of data is not guaranteed and provided for informational
          purposes only. For official reserve reports, visit{' '}
          <Link
            href="https://worldlibertyfinancial.com/usd1"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-foreground-tertiary"
          >
            worldlibertyfinancial.com/usd1
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 border-t border-border-secondary py-6 md:flex-row md:items-center">
        <p className="text-sm text-foreground-tertiary">
          &copy; {new Date().getFullYear()} World Liberty Financial LLC
        </p>
        <Link
          href={siteConfig.links.wlf}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-foreground-secondary transition-colors hover:text-foreground"
        >
          Go to WLFI
        </Link>
      </div>
    </footer>
  );
}
