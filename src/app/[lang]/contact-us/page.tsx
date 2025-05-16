
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.pageTitleContactUs,
    description: dictionary.metaDescriptionContactUs,
  };
}

export default async function ContactUsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const contactEmail = "info@codebarregenerator.com";

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{dictionary.contactUsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <p>{dictionary.contactUsP1}</p>
          <p>{dictionary.contactUsP2}</p>
          <p>
            {dictionary.contactUsP3.replace('{email}', '')}
            <Link href={`mailto:${contactEmail}`} className="text-primary hover:underline">
              {contactEmail}
            </Link>
            .
          </p>
          <p>{dictionary.contactUsP4}</p>
        </CardContent>
      </Card>
    </div>
  );
}

