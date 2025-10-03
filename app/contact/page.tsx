'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Mail, MapPin } from 'lucide-react';
import { useTranslations } from '@/app/providers/TranslationProvider';
import LanguageSelector from '@/components/LanguageSelector';
import Logo from '@/components/icons/Logo';

export default function ContactPage() {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');

    const web3FormsData = {
      access_key: "5f00a082-1273-4a83-8285-c8966b573511",
      subject: `Contact Form: ${formData.subject}`,
      from_name: formData.name,
      email: formData.email,
      message: formData.message
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(web3FormsData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage(t.contact.form.successMessage);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setErrors({});
      } else {
        setSubmitMessage(t.contact.form.errorMessage);
      }
    } catch (error) {
      setSubmitMessage(t.contact.form.errorMessage);
    } finally {
      setIsSubmitting(false);
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

      {/* Hero Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-6xl font-extrabold tracking-tighter sm:text-7xl">
              <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
                {t.contact.title}
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              {t.contact.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 max-w-5xl mx-auto">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tighter mb-8">{t.contact.contactInfo}</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-black p-3">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{t.contact.email}</p>
                      <a 
                        href="mailto:info@rocketscience.com" 
                        className="text-gray-600 hover:text-black transition-colors"
                      >
                        info@rocketscience.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-black p-3">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{t.contact.location}</p>
                      <p className="text-gray-600">
                        Miami, Florida<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-4">{t.contact.forArtists}</h3>
                <p className="text-gray-600 mb-6">
                  {t.contact.forArtistsDesc}
                </p>
                <Link 
                  href="/apply" 
                  className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all"
                >
                  {t.nav.apply}
                  <Send className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitMessage && (
                  <div className={`rounded-xl p-4 ${
                    submitMessage.includes('error') || submitMessage.includes('hubo') 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <p className={`text-sm ${
                      submitMessage.includes('error') || submitMessage.includes('hubo') ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {submitMessage}
                    </p>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    {t.contact.form.name} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20`}
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    {t.contact.form.email} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20`}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    {t.contact.form.subject} *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${errors.subject ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20`}
                    required
                  >
                    <option value="">{t.contact.form.selectSubject}</option>
                    <option value="general">{t.contact.form.generalInquiry}</option>
                    <option value="support">{t.contact.form.technicalSupport}</option>
                    <option value="business">{t.contact.form.businessPartnership}</option>
                    <option value="press">{t.contact.form.pressMedia}</option>
                    <option value="other">{t.contact.form.other}</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    {t.contact.form.message} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full rounded-xl border ${errors.message ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20 resize-none`}
                    required
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-black px-8 py-4 text-white font-medium shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? t.contact.form.sending : t.contact.form.sendMessage}
                  {!isSubmitting && <Send className="h-4 w-4" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}