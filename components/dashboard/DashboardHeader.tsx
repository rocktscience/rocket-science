// components/dashboard/DashboardHeader.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from '@/app/providers/TranslationProvider';
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import LanguageSelector from '@/components/LanguageSelector';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  entity_name?: string;
  role: 'admin' | 'client' | 'viewer';
}

interface DashboardHeaderProps {
  userProfile: UserProfile;
}

export default function DashboardHeader({ userProfile }: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslations();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
          {/* Language Selector - Using the same component as rest of the site */}
          <LanguageSelector />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <span className="hidden lg:block">
                {userProfile.full_name || userProfile.email}
              </span>
            </button>

            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-0" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    {t.dashboard?.signOut || 'Sign Out'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}