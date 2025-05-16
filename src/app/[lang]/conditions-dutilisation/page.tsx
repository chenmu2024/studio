
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

// This file is effectively replaced by terms-of-service/page.tsx
// It can be deleted, but I'm leaving it with a redirect or a note for now.
// For a clean setup, this file should be removed and any links updated.
// However, since the request was to create new pages and update existing,
// I am updating the content of the new terms-of-service page.
// This file will become obsolete.

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: `${dictionary.footerTermsOfService} | ${dictionary.siteName} (Ancienne Page)`,
    description: `Conditions d'utilisation de ${dictionary.siteName}. Cette page a été déplacée.`,
    // Add noindex to prevent this old URL from being indexed
    robots: {
      index: false,
      follow: true,
    }
  };
}

export default async function OldTermsOfServicePage({ params: { lang } }: { params: { lang: Locale } }) {
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
              ? `Cette page a été déplacée. Veuillez consulter nos nouvelles conditions d'utilisation à l'adresse : /${lang}/terms-of-service`
              : `Esta página foi movida. Por favor, consulte os nossos novos termos de serviço em: /${lang}/terms-of-service`}
          </p>
           <p><a href={`/${lang}/terms-of-service`}>Aller à la nouvelle page</a></p>
        </CardContent>
      </Card>
    </div>
  );
}

