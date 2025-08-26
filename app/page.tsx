'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { useTranslations } from '@/app/providers/TranslationProvider';
import LanguageSelector from '@/components/LanguageSelector';

export default function HomePage() {
  const { t, locale } = useTranslations();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center">
                <Logo className="h-8 w-auto" />
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <Link href="#label" className="text-gray-600 hover:text-gray-900 transition">{t.nav.label}</Link>
                <Link href="#publishing" className="text-gray-600 hover:text-gray-900 transition">{t.nav.publishing}</Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition">{t.nav.contact}</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Link 
                href="/login" 
                className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
              >
                {t.nav.launchpad}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent block leading-tight">
                {t.home.hero.title}
              </span>
            </h1>
            <p className="mt-8 text-lg text-gray-600 font-light leading-relaxed">
              {t.home.hero.description}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link 
                href="#label" 
                className="rounded-full bg-gray-900 px-8 py-3 text-sm font-medium text-white shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all"
              >
                {t.home.hero.exploreServices}
              </Link>
              <Link 
                href="/explore" 
                className="rounded-full px-8 py-3 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:text-gray-900 hover:ring-gray-400 transition-all"
              >
                {t.home.hero.launchpadPlatform} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rocket Science Music Group */}
      <section id="label" className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-auto text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent block leading-tight">
                {t.home.label.title}
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.home.label.description}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.home.label.artistDev.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t.home.label.artistDev.subtitle}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {t.home.label.artistDev.features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.home.label.production.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t.home.label.production.subtitle}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {t.home.label.production.features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.home.label.distribution.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t.home.label.distribution.subtitle}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {t.home.label.distribution.features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Rocket Science Music Publishing */}
      <section id="publishing" className="py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-auto text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
                {t.home.publishing.title}
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.home.publishing.description}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.home.publishing.rights.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t.home.publishing.rights.subtitle}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {t.home.publishing.rights.features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.home.publishing.licensing.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t.home.publishing.licensing.subtitle}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {t.home.publishing.licensing.features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.home.publishing.royalties.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t.home.publishing.royalties.subtitle}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {t.home.publishing.royalties.features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LAUNCHPAD Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              {t.home.launchpad.badge}
            </div>
            <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tighter mb-6">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
                {t.home.launchpad.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              {t.home.launchpad.description}
            </p>
            <Link 
              href="/explore" 
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-white font-medium shadow-lg hover:shadow-xl transition-all"
            >
              {t.home.launchpad.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-y-10 gap-x-8 md:grid-cols-4 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-extrabold tracking-tighter">
                <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                  318M+
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-400">{t.home.stats.totalStreams}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold tracking-tighter">
                <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                  $350K+
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-400">{t.home.stats.streamingRevenue}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold tracking-tighter">
                <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                  100+
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-400">{t.home.stats.dsp}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold tracking-tighter">
                <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                  $50K+
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-400">{t.home.stats.publishingRevenue}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="services" className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tighter">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
                {t.home.process.title}
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t.home.process.subtitle}
            </p>
          </div>
          
          <div className="mx-auto max-w-2xl">
            <div className="space-y-10">
              <div className="relative flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-10 items-center justify-center rounded-full bg-black text-white font-semibold">
                    1
                  </div>
                  <div className="h-full w-px bg-gray-200 mt-2"></div>
                </div>
                <div className="pb-10">
                  <h3 className="text-lg font-semibold mb-2">{t.home.process.steps[0].title}</h3>
                  <p className="text-gray-600">
                    {t.home.process.steps[0].description}
                  </p>
                </div>
              </div>
              
              <div className="relative flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-10 items-center justify-center rounded-full bg-black text-white font-semibold">
                    2
                  </div>
                  <div className="h-full w-px bg-gray-200 mt-2"></div>
                </div>
                <div className="pb-10">
                  <h3 className="text-lg font-semibold mb-2">{t.home.process.steps[1].title}</h3>
                  <p className="text-gray-600">
                    {t.home.process.steps[1].description}
                  </p>
                </div>
              </div>
              <div className="relative flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white font-semibold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t.home.process.steps[2].title}</h3>
                  <p className="text-gray-600">
                    {t.home.process.steps[2].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-auto text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
                {t.home.cta.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              {t.home.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/apply" 
                className="rounded-full bg-black px-8 py-4 text-white font-medium shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all"
              >
                {t.home.cta.submitMusic}
              </Link>
              <Link 
                href="/contact" 
                className="rounded-full px-8 py-4 font-medium text-black ring-1 ring-gray-300 hover:ring-gray-400 transition-all"
              >
                {t.home.cta.contactTeam}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              {t.footer.copyright}
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition">{t.footer.privacyPolicy}</Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition">{t.footer.termsOfService}</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition">{t.nav.contact}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}