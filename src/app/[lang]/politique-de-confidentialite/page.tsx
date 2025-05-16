
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

// This file is effectively replaced by privacy-policy/page.tsx
// It can be deleted, but I'm leaving it with a redirect or a note for now.
// For a clean setup, this file should be removed and any links updated.
// However, since the request was to create new pages and update existing,
// I am updating the content of the new privacy-policy page.
// This file will become obsolete.

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: `${dictionary.footerPrivacyPolicy} | ${dictionary.siteName} (Ancienne Page)`,
    description: `Politique de confidentialité de ${dictionary.siteName}. Cette page a été déplacée.`,
    // Add noindex to prevent this old URL from being indexed
    robots: {
      index: false,
      follow: true,
    }
  };
}

export default async function OldPrivacyPolicyPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  // It's better to implement a server-side redirect in next.config.js for old paths.
  // For now, a simple message:
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Page déplacée</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <p>
            {lang === 'fr' 
              ? `Cette page a été déplacée. Veuillez consulter notre nouvelle politique de confidentialité à l'adresse : /${lang}/privacy-policy`
              : `Esta página foi movida. Por favor, consulte a nossa nova política de privacidade em: /${lang}/privacy-policy`}
          </p>
          <p><a href={`/${lang}/privacy-policy`}>Aller à la nouvelle page</a></p>
        </CardContent>
      </Card>
    </div>
  );
}

