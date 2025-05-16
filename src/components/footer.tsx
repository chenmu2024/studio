import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/lib/dictionaries';
import Link from 'next/link';

interface FooterProps {
  lang: Locale;
  dictionary: Pick<Dictionary, 'footerCopyright' | 'footerPrivacyPolicy' | 'footerTermsOfService'>;
}

export function Footer({ lang, dictionary }: FooterProps) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 mt-12 border-t border-border/50 bg-card">
      <div className="container mx-auto text-center text-muted-foreground px-4">
        <p className="mb-2">
          {dictionary.footerCopyright.replace('{year}', currentYear.toString())}
        </p>
        <nav className="flex justify-center space-x-4">
          <Link href={`/${lang}/politique-de-confidentialite`} className="hover:text-primary transition-colors">
            {dictionary.footerPrivacyPolicy}
          </Link>
          <span className="text-border">|</span>
          <Link href={`/${lang}/conditions-dutilisation`} className="hover:text-primary transition-colors">
            {dictionary.footerTermsOfService}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
