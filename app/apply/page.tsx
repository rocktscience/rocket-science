'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { useTranslations } from '@/app/providers/TranslationProvider';
import LanguageSelector from '@/components/LanguageSelector';
import Logo from '@/components/icons/Logo';

export default function ApplyPage() {
  const { t } = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    entity_name: '',
    role: '',
    country: '',
    spotify_url: '',
    apple_music_url: '',
    youtube_url: '',
    soundcloud_url: '',
    bandcamp_url: '',
    other_url: '',
    website_url: '',
    instagram_url: '',
    twitter_url: '',
    facebook_url: '',
    tiktok_url: '',
    other_social_url: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.full_name) newErrors.full_name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.entity_name) newErrors.entity_name = 'Entity name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.country) newErrors.country = 'Country is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // At least 2 content URLs
    const contentUrls = [
      formData.spotify_url,
      formData.apple_music_url,
      formData.youtube_url,
      formData.soundcloud_url,
      formData.bandcamp_url,
      formData.other_url
    ].filter(url => url.trim() !== '');
    
    if (contentUrls.length < 2) {
      newErrors.content = 'Please provide at least 2 content URLs';
    }
    
    // At least 1 social media URL
    const socialUrls = [
      formData.website_url,
      formData.instagram_url,
      formData.twitter_url,
      formData.facebook_url,
      formData.tiktok_url,
      formData.other_social_url
    ].filter(url => url.trim() !== '');
    
    if (socialUrls.length < 1) {
      newErrors.social = 'Please provide at least 1 social media or website URL';
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

    // Prepare data for Web3Forms
    const web3FormsData = {
      access_key: "YOUR_ACCESS_KEY", // <-- PUT YOUR ACCESS KEY HERE
      subject: "New Application Form Submission",
      from_name: formData.full_name,
      
      // Personal Information
      "Full Name": formData.full_name,
      "Email": formData.email,
      "Entity Name": formData.entity_name,
      "Role": formData.role,
      "Country": formData.country,
      
      // Content URLs
      "Spotify URL": formData.spotify_url || "Not provided",
      "Apple Music URL": formData.apple_music_url || "Not provided",
      "YouTube URL": formData.youtube_url || "Not provided",
      "SoundCloud URL": formData.soundcloud_url || "Not provided",
      "Bandcamp URL": formData.bandcamp_url || "Not provided",
      "Other Platform URL": formData.other_url || "Not provided",
      
      // Social Media
      "Website": formData.website_url || "Not provided",
      "Instagram": formData.instagram_url || "Not provided",
      "Twitter/X": formData.twitter_url || "Not provided",
      "Facebook": formData.facebook_url || "Not provided",
      "TikTok": formData.tiktok_url || "Not provided",
      "Other Social": formData.other_social_url || "Not provided"
    };

    console.log('Sending to Web3Forms:', web3FormsData);

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
      console.log('Web3Forms response:', result);

      if (result.success) {
        setSubmitMessage(t.apply.form.successMessage);
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          entity_name: '',
          role: '',
          country: '',
          spotify_url: '',
          apple_music_url: '',
          youtube_url: '',
          soundcloud_url: '',
          bandcamp_url: '',
          other_url: '',
          website_url: '',
          instagram_url: '',
          twitter_url: '',
          facebook_url: '',
          tiktok_url: '',
          other_social_url: ''
        });
        setErrors({});
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitMessage(t.apply.form.errorMessage);
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
                {t.apply.title}
              </span>
            </h1>
            <p className="mt-4 text-xl font-medium text-gray-800">
              {t.apply.subtitle}
            </p>
            <p className="mt-6 text-lg text-gray-600">
              {t.apply.description}
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-gray-50 py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
            {submitMessage && (
              <div className={`mb-8 rounded-2xl p-6 ${
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

            <div className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold">{t.apply.form.personalInfo}</h3>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                      {t.apply.form.fullName} *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className={`w-full rounded-xl border ${errors.full_name ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20`}
                      required
                    />
                    {errors.full_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                      {t.apply.form.email} *
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
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    {t.apply.form.entityName} *
                  </label>
                  <input
                    type="text"
                    name="entity_name"
                    value={formData.entity_name}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${errors.entity_name ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20`}
                    required
                  />
                  {errors.entity_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.entity_name}</p>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                      {t.apply.form.role} *
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g., Artist, Manager, Label Owner"
                      className={`w-full rounded-xl border ${errors.role ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20`}
                      required
                    />
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                      {t.apply.form.country} *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full rounded-xl border ${errors.country ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20`}
                      required
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content URLs */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">{t.apply.form.content}</h3>
                  <p className="text-sm text-gray-600">{t.apply.form.contentNote}</p>
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                  )}
                </div>
                
                <div className="grid gap-4">
                  <input
                    type="url"
                    name="spotify_url"
                    value={formData.spotify_url}
                    onChange={handleChange}
                    placeholder="Spotify URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <input
                    type="url"
                    name="apple_music_url"
                    value={formData.apple_music_url}
                    onChange={handleChange}
                    placeholder="Apple Music URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <input
                    type="url"
                    name="youtube_url"
                    value={formData.youtube_url}
                    onChange={handleChange}
                    placeholder="YouTube URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <input
                    type="url"
                    name="soundcloud_url"
                    value={formData.soundcloud_url}
                    onChange={handleChange}
                    placeholder="SoundCloud URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <input
                    type="url"
                    name="bandcamp_url"
                    value={formData.bandcamp_url}
                    onChange={handleChange}
                    placeholder="Bandcamp URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <input
                    type="url"
                    name="other_url"
                    value={formData.other_url}
                    onChange={handleChange}
                    placeholder="Other Platform URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>
              </div>

              {/* Social Media URLs */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">{t.apply.form.socialMedia}</h3>
                  <p className="text-sm text-gray-600">{t.apply.form.socialNote}</p>
                  {errors.social && (
                    <p className="mt-1 text-sm text-red-600">{errors.social}</p>
                  )}
                </div>
                
                <div className="grid gap-4">
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    placeholder="Website URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <input
                    type="url"
                    name="instagram_url"
                    value={formData.instagram_url}
                    onChange={handleChange}
                    placeholder="Instagram URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <input
                    type="url"
                    name="twitter_url"
                    value={formData.twitter_url}
                    onChange={handleChange}
                    placeholder="Twitter/X URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <input
                    type="url"
                    name="facebook_url"
                    value={formData.facebook_url}
                    onChange={handleChange}
                    placeholder="Facebook URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <input
                    type="url"
                    name="tiktok_url"
                    value={formData.tiktok_url}
                    onChange={handleChange}
                    placeholder="TikTok URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <input
                    type="url"
                    name="other_social_url"
                    value={formData.other_social_url}
                    onChange={handleChange}
                    placeholder="Other Social Media URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-sm text-gray-600">
                {t.apply.form.disclaimer}
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-black px-8 py-4 text-white font-medium shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? t.apply.form.submitting : t.apply.form.submit}
                {!isSubmitting && <Send className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}