
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import React from 'react';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.pageTitleTermsOfService,
    description: dictionary.metaDescriptionTermsOfService,
  };
}

export default async function TermsOfServicePage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  // Using privacyPolicyLastUpdated key as it shares the same format and date for now
  // Ideally, this would be a separate termsLastUpdated key if dates differ.
  const lastUpdatedDate = dictionary.privacyPolicyLastUpdated.replace('{date}', new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(2025, 4, 16))); 
  const siteName = "CodeBarreGenerator.com"; // Used for interpolation
  const contactEmail = "info@codebarregenerator.com"; // Used for interpolation

  const interpolate = (text: string) => {
    return text
      .replace(/{siteName}/g, siteName)
      .replace(/{contactEmail}/g, contactEmail)
      .replace(/{dictionary.siteName.toLowerCase\(\)}/g, dictionary.siteName.toLowerCase());
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{dictionary.footerTermsOfService}</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <p>{lastUpdatedDate}</p>
          {dictionary.termsOfServiceIntro && <p>{interpolate(dictionary.termsOfServiceIntro)}</p>}
          
          {dictionary.termsOfServiceSections?.map((section, index) => (
            <React.Fragment key={index}>
              <h2 className="text-xl font-semibold mt-6 mb-3">{interpolate(section.title)}</h2>
              {section.paragraphs.map((p, pIndex) => (
                <p key={pIndex} className="mb-3">{interpolate(p)}</p>
              ))}
              {section.listItems && (
                <ul className="list-disc pl-5 mb-3">
                  {section.listItems.map((item, itemIndex) => (
                    <li key={itemIndex}>{interpolate(item)}</li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
