// lib/i18n/useTranslations.ts
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, type Locale } from './config';
import enTranslations from './translations/en.json';
import esTranslations from './translations/es.json';

const translations: Record<Locale, typeof enTranslations> = {
  en: enTranslations,
  es: esTranslations,
};

export function useTranslations() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  
  return {
    t: translations[locale],
    locale,
  };
}