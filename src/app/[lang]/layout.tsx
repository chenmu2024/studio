import type { Metadata, Viewport } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { i18n } from '@/i18n-config';

// This function is not needed if RootLayout already handles static params for lang
// export async function generateStaticParams() {
//   return i18n.locales.map((locale) => ({ lang: locale }));
// }

// This metadata would override the root if defined. 
// Generally, keep main metadata in root layout and specify language-specific alternates there.
// export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
//   const dictionary = await getDictionary(lang);
//   return {
//     title: dictionary.pageTitle,
//     description: dictionary.metaDescription,
//   };
// }


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
        footerTermsOfService: dictionary.footerTermsOfService
      }} />
    </>
  );
}
