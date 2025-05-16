"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Locale } from '@/i18n-config';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  dict: {
    switchToFrench: string;
    switchToPortuguese: string;
    languageSwitcherLabel: string;
  };
}

export function LanguageSwitcher({ currentLocale, dict }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getLocalizedPath = (locale: Locale) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale; // Assumes locale is always the first segment after domain
    return segments.join('/');
  };

  const languages: { locale: Locale; label: string }[] = [
    { locale: 'fr', label: dict.switchToFrench },
    { locale: 'pt', label: dict.switchToPortuguese },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Globe className="mr-2 h-4 w-4" />
          {currentLocale === 'fr' ? dict.switchToFrench : dict.switchToPortuguese}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem key={lang.locale} asChild>
            <Link href={getLocalizedPath(lang.locale)} prefetch={false} replace>
              {lang.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
