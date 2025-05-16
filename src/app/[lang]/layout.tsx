export const runtime = 'edge'; // <--- 添加这一行

import type { Metadata, Viewport } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { i18n } from '@/i18n-config';

export default async function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <>
      <Header lang={lang} dictionary={{
        siteName: dictionary.siteName,
        switchToFrench: dictionary.switchToFrench,
        switchToPortuguese: dictionary.switchToPortuguese,
        languageSwitcherLabel: dictionary.languageSwitcherLabel,
      }} />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
      <Footer lang={lang} dictionary={{
        footerCopyright: dictionary.footerCopyright,
        footerPrivacyPolicy: dictionary.footerPrivacyPolicy,
        footerTermsOfService: dictionary.footerTermsOfService,
        footerAboutUs: dictionary.footerAboutUs,
        footerContactUs: dictionary.footerContactUs
      }} />
    </>
  );
}
