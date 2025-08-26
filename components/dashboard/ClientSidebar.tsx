// components/dashboard/ClientSidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/app/providers/TranslationProvider';
import {
  HomeIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  CogIcon,
  UsersIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Logo from '@/components/icons/Logo';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  entity_name?: string;
  role: 'admin' | 'client' | 'viewer';
  services?: string[];
}

interface ClientSidebarProps {
  userProfile: UserProfile;
}

export default function ClientSidebar({ userProfile }: ClientSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslations();

  // Build navigation based on user role and services
  const getNavigation = () => {
    const baseNav = [
      { name: 'overview', href: '/dashboard', icon: HomeIcon },
    ];

    if (userProfile.role === 'admin') {
      // Admin gets all tabs
      return [
        ...baseNav,
        { name: 'releases', href: '/dashboard/releases', icon: MusicalNoteIcon },
        { name: 'compositions', href: '/dashboard/compositions', icon: MicrophoneIcon },
        { name: 'analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
        { name: 'earnings', href: '/dashboard/earnings', icon: CurrencyDollarIcon },
        { name: 'users', href: '/dashboard/users', icon: UsersIcon },
        { name: 'contracts', href: '/dashboard/contracts', icon: DocumentTextIcon },
        { name: 'settings', href: '/dashboard/settings', icon: CogIcon },
      ];
    } else {
      // Client/Viewer navigation based on services
      const nav = [...baseNav];
      
      // Add releases tab if user has distribution service
      if (userProfile.services?.includes('distribution') || userProfile.services?.includes('label')) {
        nav.push({ name: 'releases', href: '/dashboard/releases', icon: MusicalNoteIcon });
      }
      
      // Add compositions tab if user has publishing service
      if (userProfile.services?.includes('publishing')) {
        nav.push({ name: 'compositions', href: '/dashboard/compositions', icon: MicrophoneIcon });
      }
      
      // All clients/viewers get analytics and earnings
      nav.push(
        { name: 'analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
        { name: 'earnings', href: '/dashboard/earnings', icon: CurrencyDollarIcon }
      );
      
      // Settings for everyone
      nav.push({ name: 'settings', href: '/dashboard/settings', icon: CogIcon });
      
      return nav;
    }
  };

  const navigation = getNavigation();

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <button
          type="button"
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6 text-gray-900" />
        </button>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6 text-white" />
                </button>
              </div>
              <SidebarContent 
                pathname={pathname} 
                t={t} 
                navigation={navigation} 
                userProfile={userProfile} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <SidebarContent 
            pathname={pathname} 
            t={t} 
            navigation={navigation} 
            userProfile={userProfile} 
          />
        </div>
      </div>
    </>
  );
}

function SidebarContent({ 
  pathname, 
  t, 
  navigation, 
  userProfile 
}: { 
  pathname: string; 
  t: any; 
  navigation: any[];
  userProfile: UserProfile;
}) {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo className="h-8 w-auto" />
        </Link>
      </div>
      
      {/* User info */}
      <div className="border-b border-gray-200 pb-4">
        <p className="text-sm font-semibold text-gray-900">
          {userProfile.entity_name || userProfile.full_name}
        </p>
        <p className="text-xs text-gray-500 capitalize flex items-center gap-1 mt-1">
          {userProfile.role === 'admin' && 'Administrator'}
          {userProfile.role === 'client' && 'Client'}
          {userProfile.role === 'viewer' && 'Viewer (Read-only)'}
        </p>
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-lg p-2 text-sm leading-6 font-semibold
                        ${
                          isActive
                            ? 'bg-gray-50 text-gray-900'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <item.icon
                        className={`
                          h-6 w-6 shrink-0
                          ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'}
                        `}
                      />
                      {(() => {
                        const key = item.name as keyof typeof t.dashboard.nav;
                        return t.dashboard?.nav?.[key] || 
                               (item.name.charAt(0).toUpperCase() + item.name.slice(1));
                      })()}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
}