'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LogIn, Lock } from 'lucide-react';
import { useTranslations } from '@/app/providers/TranslationProvider';
import LanguageSelector from '@/components/LanguageSelector';
import Logo from '@/components/icons/Logo';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const { t } = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Always redirect to unified dashboard
        router.push('/dashboard');
      }
    };
    
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Always redirect to unified dashboard regardless of role
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.nav.back}
            </Link>
            <Link href="/" className="flex items-center">
              <Logo className="h-8 w-auto" />
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl mb-2">
                <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
                  {t.login.title}
                </span>
              </h1>
              <p className="text-gray-600">
                {t.login.subtitle}
              </p>
            </div>

            {/* Login Form */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    {t.login.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    {t.login.password}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Link 
                    href="/forgot-password" 
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    {t.login.forgotPassword}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full bg-black px-8 py-4 text-white font-medium shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? t.login.signingIn : t.login.signIn}
                  {!isLoading && <LogIn className="h-4 w-4" />}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  {t.login.noAccount}{' '}
                  <Link 
                    href="/apply" 
                    className="font-medium text-black hover:underline"
                  >
                    {t.login.applyAccess}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}