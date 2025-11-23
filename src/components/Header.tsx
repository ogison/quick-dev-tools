'use client';

import { Home, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';

export default function Header() {
  const t = useTranslations('common');

  return (
    <header
      className={`sticky top-0 z-50 border-b border-gray-200 bg-white text-black backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80 dark:text-white`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 text-xl font-bold">
            <Home className="h-5 w-5" />
            QuickDevTools
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              href="/contact"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Mail className="h-4 w-4" />
              {t('contact')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
