import 'server-only';
import type { Locale } from '@/i18n-config';

// We enumerate all dictionaries here for better linting and typescript support
const dictionaries = {
  fr: () => import('@/dictionaries/fr.json').then((module) => module.default),
  pt: () => import('@/dictionaries/pt.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  const loader = dictionaries[locale] || dictionaries.fr;
  return loader();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
