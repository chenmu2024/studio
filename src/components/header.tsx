
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import { LanguageSwitcher } from './language-switcher';
// Removed: import { Barcode } from 'lucide-react';
import Image from 'next/image'; // Added for Next.js optimized images

interface HeaderProps {
  lang: Locale;
  dictionary: Pick<Dictionary, 'siteName' | 'switchToFrench' | 'switchToPortuguese' | 'languageSwitcherLabel'>;
}

export function Header({ lang, dictionary }: HeaderProps) {
  return (
    <header className="py-4 shadow-md bg-card">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href={`/${lang}`} className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
          {/* Replaced Barcode icon with an Image component for the logo */}
          <Image src="/logo.png" alt={dictionary.siteName} width={32} height={32} className="h-8 w-8" />
          <span>{dictionary.siteName}</span>
        </Link>
        <LanguageSwitcher
          currentLocale={lang}
          dict={{
            switchToFrench: dictionary.switchToFrench,
            switchToPortuguese: dictionary.switchToPortuguese,
            languageSwitcherLabel: dictionary.languageSwitcherLabel,
          }}
        />
      </div>
    </header>
  );
}
