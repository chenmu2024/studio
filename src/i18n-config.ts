export const i18n = {
  defaultLocale: 'fr',
  locales: ['fr', 'pt'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
