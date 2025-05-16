
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.pageTitleAboutUs,
    description: dictionary.metaDescriptionAboutUs,
  };
}

export default async function AboutUsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{dictionary.aboutUsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <p>{dictionary.aboutUsP1}</p>
          <p>{dictionary.aboutUsP2}</p>
          <p>{dictionary.aboutUsP3}</p>
          <p>{dictionary.aboutUsP4}</p>
        </CardContent>
      </Card>
    </div>
  );
}

