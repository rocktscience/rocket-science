'use client';

import React from 'react';
import { ChevronLeft, Music, FileText, Zap, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { useTranslations } from '@/app/providers/TranslationProvider';
import LanguageSelector from '@/components/LanguageSelector';

export default function ExplorePage() {
  const { t } = useTranslations();

  const platforms = ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 
    'Deezer', 'Tidal', 'SoundCloud', 'Pandora'];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">{t.nav.back}</span>
            </Link>
            <Link href="/" className="flex items-center">
              <Logo className="h-8 w-auto" />
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent block leading-tight">
                {t.explore.title}
              </span>
            </h1>
            <p className="mt-8 text-lg text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
              {t.explore.subtitle}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link 
                href="/apply" 
                className="rounded-full bg-gray-900 px-8 py-3 text-sm font-medium text-white shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all"
              >
                {t.explore.applyAccess}
              </Link>
              <Link 
                href="/login" 
                className="rounded-full px-8 py-3 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:text-gray-900 hover:ring-gray-400 transition-all"
              >
                {t.explore.clientLogin} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is LAUNCHPAD */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-auto text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent block leading-tight">
                {t.explore.whatIs.title}
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {t.explore.whatIs.description}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
              <Zap className="w-12 h-12 mb-4 text-gray-900" />
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.explore.features.fast.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t.explore.features.fast.subtitle}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {t.explore.features.fast.items.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
              <Music className="w-12 h-12 mb-4 text-gray-900" />
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.explore.features.control.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t.explore.features.control.subtitle}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {t.explore.features.control.items.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
              <FileText className="w-12 h-12 mb-4 text-gray-900" />
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.explore.features.analytics.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t.explore.features.analytics.subtitle}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {t.explore.features.analytics.items.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Coverage */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-auto text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
                {t.explore.platforms.title}
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.explore.platforms.subtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {platforms.map((platform) => (
                <div key={platform} className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm font-medium text-gray-900">{platform}</p>
                </div>
              ))}
            </div>
            <p className="text-center mt-8 text-sm text-gray-600">
              {t.explore.platforms.more}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Model */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              {t.explore.pricing.badge}
            </div>
            <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tighter mb-6">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
                {t.explore.pricing.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              {t.explore.pricing.subtitle}
            </p>

            <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 p-12 shadow-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg">{t.explore.pricing.annual}</span>
                  <span className="text-lg line-through text-gray-400">$49.99</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">{t.explore.pricing.perRelease}</span>
                  <span className="text-lg line-through text-gray-400">$19.99</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">{t.explore.pricing.codes}</span>
                  <span className="text-lg line-through text-gray-400">$5.99</span>
                </div>
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold">{t.explore.pricing.total}</span>
                    <span className="text-3xl font-extrabold text-green-600">$0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-24 lg:py-32 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-auto text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
              <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                {t.explore.whoUsesIt.title}
              </span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              {t.explore.whoUsesIt.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">{t.explore.whoUsesIt.labels.title}</h3>
              <p className="text-gray-300 mb-6">
                {t.explore.whoUsesIt.labels.subtitle}
              </p>
              <ul className="space-y-3 text-sm">
                {t.explore.whoUsesIt.labels.features.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">{t.explore.whoUsesIt.artists.title}</h3>
              <p className="text-gray-300 mb-6">
                {t.explore.whoUsesIt.artists.subtitle}
              </p>
              <ul className="space-y-3 text-sm">
                {t.explore.whoUsesIt.artists.features.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tighter">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
                {t.explore.gettingStarted.title}
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t.explore.gettingStarted.subtitle}
            </p>
          </div>
          
          <div className="mx-auto max-w-2xl">
            <div className="space-y-10">
              {t.explore.gettingStarted.steps.map((step, idx) => (
                <div key={idx} className="relative flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-10 items-center justify-center rounded-full bg-black text-white font-semibold">
                      {idx + 1}
                    </div>
                    {idx < t.explore.gettingStarted.steps.length - 1 && (
                      <div className="h-full w-px bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  <div className={idx < t.explore.gettingStarted.steps.length - 1 ? "pb-10" : ""}>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
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
                {t.explore.cta.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              {t.explore.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/apply" 
                className="rounded-full bg-black px-8 py-4 text-white font-medium shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all"
              >
                {t.explore.cta.apply}
              </Link>
              <Link 
                href="/contact" 
                className="rounded-full px-8 py-4 font-medium text-black ring-1 ring-gray-300 hover:ring-gray-400 transition-all"
              >
                {t.explore.cta.contact}
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