'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';

import { LanguageSwitcher } from './LanguageSwitcher';

export function Footer() {
  const t = useTranslations('common');

  return (
    <footer className="border-t border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and links */}
          <div className="flex items-center space-x-6">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              QuickDevTools
            </span>
            <nav className="flex items-center space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                {t('privacy')}
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                {t('terms')}
              </Link>
            </nav>
          </div>

          {/* Right side - Help, X, and language */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <a
              href="https://x.com/ogison999"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('twitter_label')}
              className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <X className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 text-center text-gray-400">
        <p>&copy; 2025 QuickDevTools All rights reserved.</p>
      </div>
    </footer>
  );
}
