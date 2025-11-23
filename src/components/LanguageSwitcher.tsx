'use client';

import { useTransition } from 'react';

import { Languages } from 'lucide-react';
import { useLocale } from 'next-intl';

import { useRouter, usePathname } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = (newLocale: 'ja' | 'en') => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      <button
        onClick={() => switchLanguage('ja')}
        disabled={isPending}
        className={`text-sm transition-colors ${
          locale === 'ja'
            ? 'font-bold text-gray-900 dark:text-white'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
        }`}
      >
        ja
      </button>
      <span className="text-gray-400">/</span>
      <button
        onClick={() => switchLanguage('en')}
        disabled={isPending}
        className={`text-sm transition-colors ${
          locale === 'en'
            ? 'font-bold text-gray-900 dark:text-white'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
        }`}
      >
        en
      </button>
    </div>
  );
}
