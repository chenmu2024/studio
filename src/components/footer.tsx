
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/lib/dictionaries';
import Link from 'next/link';

interface FooterProps {
  lang: Locale;
  dictionary: Pick<Dictionary, 'footerCopyright' | 'footerPrivacyPolicy' | 'footerTermsOfService' | 'footerAboutUs' | 'footerContactUs'>;
}

export function Footer({ lang, dictionary }: FooterProps) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 mt-12 border-t border-border/50 bg-card">
      <div className="container mx-auto text-center text-muted-foreground px-4">
        <p className="mb-2">
          {dictionary.footerCopyright.replace('{year}', currentYear.toString())}
        </p>
        <nav className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Link href={`/${lang}/about-us`} className="hover:text-primary transition-colors">
            {dictionary.footerAboutUs}
          </Link>
          <span className="hidden sm:inline text-border">|</span>
          <Link href={`/${lang}/contact-us`} className="hover:text-primary transition-colors">
            {dictionary.footerContactUs}
          </Link>
          <span className="hidden sm:inline text-border">|</span>
          <Link href={`/${lang}/privacy-policy`} className="hover:text-primary transition-colors">
            {dictionary.footerPrivacyPolicy}
          </Link>
          <span className="hidden sm:inline text-border">|</span>
          <Link href={`/${lang}/terms-of-service`} className="hover:text-primary transition-colors">
            {dictionary.footerTermsOfService}
          </Link>
        </nav>
      </div>
    </footer>
  );
}

