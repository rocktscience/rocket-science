'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft,
  Plus,
  Search,
  X,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/icons/Logo';

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    entity_name: '',
    services: {
      label: false,
      publishing: false,
      launchpad: false
    }
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user is admin
      const adminEmails = ['admin@rocketscience.com'];
      if (!adminEmails.includes(user.email || '')) {
        router.push('/dashboard');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');

    try {
      const selectedServices = Object.entries(formData.services)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);

      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          services: selectedServices
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage('User created successfully!');
        setTimeout(() => {
          setShowForm(false);
          setSubmitMessage('');
          setFormData({
            email: '',
            password: '',
            full_name: '',
            entity_name: '',
            services: {
              label: false,
              publishing: false,
              launchpad: false
            }
          });
          router.refresh();
        }, 2000);
      } else {
        setSubmitMessage(data.error || 'Error creating user');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('Error creating user');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link 
                href="/admin/dashboard" 
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm">Back to Dashboard</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
            </div>
            <Link href="/" className="flex items-center">
              <Logo className="h-8 w-auto" />
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-8">
        {!showForm ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-xl font-semibold mb-6">Create New User</h2>
              <p className="text-gray-600 mb-8">
                Add new clients to the platform by creating their accounts. They will receive an email with their login credentials.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-all"
              >
                <Plus className="h-4 w-4" />
                Create User
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Create New User</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    PASSWORD
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>

                {/* Entity Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    ENTITY NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.entity_name}
                    onChange={(e) => setFormData({ ...formData, entity_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="Artist, Band or Label name"
                  />
                </div>

                {/* Services */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-3">
                    SERVICES
                  </label>
                  <div className="space-y-3">
                    {Object.entries(formData.services).map(([service, checked]) => (
                      <label key={service} className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => setFormData({
                              ...formData,
                              services: {
                                ...formData.services,
                                [service]: e.target.checked
                              }
                            })}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border-2 rounded transition-colors ${
                            checked ? 'bg-black border-black' : 'bg-white border-gray-300'
                          }`}>
                            {checked && <Check className="h-3 w-3 text-white absolute top-0.5 left-0.5" />}
                          </div>
                        </div>
                        <span className="text-sm capitalize">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Message */}
                {submitMessage && (
                  <div className={`p-4 rounded-lg text-sm ${
                    submitMessage.includes('success') 
                      ? 'bg-green-50 text-green-800' 
                      : 'bg-red-50 text-red-800'
                  }`}>
                    {submitMessage}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}