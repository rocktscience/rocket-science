import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/icons/Logo';

interface PageLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backHref?: string;
}

export default function PageLayout({ 
  children, 
  showBackButton = true,
  backHref = '/'
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {showBackButton && (
              <Link href={backHref} className="flex items-center space-x-2 nav-link">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Back</span>
              </Link>
            )}
            <div className={`text-xl font-light tracking-widest ${!showBackButton ? 'mx-auto' : 'ml-auto'}`}>
            <Link href="/" className="flex items-center">
              <Logo className="h-8 w-auto" />
            </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-20">
        {children}
      </div>
    </div>
  );
}