'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { useTranslations } from '@/app/providers/TranslationProvider';
import LanguageSelector from '@/components/LanguageSelector';

export default function PrivacyPage() {
  const { t, locale } = useTranslations();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm">{t.nav.back || 'Back'}</span>
            </Link>
            <Logo className="h-8 w-auto absolute left-1/2 transform -translate-x-1/2" />
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t.privacy.title}</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            {t.privacy.lastUpdated}
          </p>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.sections['1'].title}</h2>
            <p className="text-gray-600 mb-4">{t.privacy.sections['1'].content1}</p>
            <p className="text-gray-600 mb-4">{t.privacy.sections['1'].content2}</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              {t.privacy.sections['1'].list.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.sections['2'].title}</h2>
            <p className="text-gray-600 mb-4">{t.privacy.sections['2'].content}</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              {t.privacy.sections['2'].list.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.sections['3'].title}</h2>
            <p className="text-gray-600 mb-4">{t.privacy.sections['3'].content}</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              {t.privacy.sections['3'].list.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.sections['4'].title}</h2>
            <p className="text-gray-600 mb-4">{t.privacy.sections['4'].content}</p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.sections['5'].title}</h2>
            <p className="text-gray-600 mb-4">{t.privacy.sections['5'].content1}</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              {t.privacy.sections['5'].list.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p className="text-gray-600 mt-4">{t.privacy.sections['5'].content2}</p>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.sections['6'].title}</h2>
            <p className="text-gray-600 mb-4">{t.privacy.sections['6'].content1}</p>
            <p className="text-gray-600 mb-4">{t.privacy.sections['6'].content2}</p>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.sections['7'].title}</h2>
            <p className="text-gray-600 mb-4">{t.privacy.sections['7'].content}</p>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.sections['8'].title}</h2>
            <p className="text-gray-600 mb-4">{t.privacy.sections['8'].content}</p>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.sections['9'].title}</h2>
            <p className="text-gray-600 mb-4">{t.privacy.sections['9'].content}</p>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.sections['10'].title}</h2>
            <p className="text-gray-600 mb-4">{t.privacy.sections['10'].content}</p>
          </section>

          {/* Section 11 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.sections['11'].title}</h2>
            <p className="text-gray-600 mb-4">{t.privacy.sections['11'].content}</p>
          </section>

          {/* Section 12 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.sections['12'].title}</h2>
            <p className="text-gray-600 mb-4">{t.privacy.sections['12'].content}</p>
          </section>

          {/* Section 13 - Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.sections['13'].title}</h2>
            <p className="text-gray-600 mb-4">{t.privacy.sections['13'].content}</p>
            <div className="text-gray-600">
              <p>{t.privacy.sections['13'].contactInfo.company}</p>
              <p>{t.privacy.sections['13'].contactInfo.email}</p>
              <p>{t.privacy.sections['13'].contactInfo.location}</p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              {t.footer.copyright}
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition">
                {t.footer.privacyPolicy}
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition">
                {t.footer.termsOfService}
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition">
                {t.nav.contact}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}