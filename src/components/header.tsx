import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import { LanguageSwitcher } from './language-switcher';
import { Barcode } from 'lucide-react';

interface HeaderProps {
  lang: Locale;
  dictionary: Dictionary['header'] & Pick<Dictionary, 'siteName' | 'switchToFrench' | 'switchToPortuguese' | 'languageSwitcherLabel'>;
}

export function Header({ lang, dictionary }: HeaderProps) {
  return (
    <header className="py-4 shadow-md bg-card">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href={`/${lang}`} className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
          <Barcode className="h-8 w-8" />
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
