'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '@/lib/i18n/translations/en.json';
import esTranslations from '@/lib/i18n/translations/es.json';

type Locale = 'en' | 'es';

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof enTranslations;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    // Check for saved language preference
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && (saved === 'en' || saved === 'es')) {
      setLocale(saved);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const translations = locale === 'en' ? enTranslations : esTranslations;

  return (
    <TranslationContext.Provider value={{ locale, setLocale: handleSetLocale, t: translations }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslations must be used within TranslationProvider');
  }
  return context;
}