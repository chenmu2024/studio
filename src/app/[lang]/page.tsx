import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { BarcodeGenerator } from '@/components/barcode-generator';
import type { Metadata } from 'next';

type Props = {
  params: { lang: Locale };
};

export async function generateMetadata({ params: { lang } }: Props): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.pageTitle,
    description: dictionary.metaDescription,
    // Ensure alternates in root layout are sufficient or add specific ones here
  };
}

export default async function HomePage({ params: { lang } }: Props) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen flex flex-col">
      <BarcodeGenerator dictionary={dictionary} />
    </div>
  );
}
