'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';
import { getFeaturedTools, TOOL_TRANSLATION_KEYS } from '@/constants/tools';

export default function HomePage() {
  const tools = getFeaturedTools();
  const t = useTranslations('home');
  const tTools = useTranslations('tools');

  // Get translated tool data
  const getToolTranslation = (toolId: string) => {
    const key = TOOL_TRANSLATION_KEYS[toolId as keyof typeof TOOL_TRANSLATION_KEYS];
    if (!key) {
      return null;
    }
    return {
      title: tTools(key.titleKey as 'title'),
      description: tTools(key.descriptionKey as 'description'),
    };
  };

  return (
    <div className="text-foreground bg-main-background min-h-screen transition-colors">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold">QuickDevTools</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">{t('hero')}</p>
        </div>
      </section>

      {/* Tools Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">{tTools('title')}</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const translated = getToolTranslation(tool.id);
              return (
                <Link key={tool.id} href={tool.href} className="group">
                  <Card className="flex h-[420px] cursor-pointer flex-col overflow-hidden border-gray-200 bg-white transition-all duration-200 hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-gray-900/25">
                    <div className="h-48 w-full flex-shrink-0">{tool.icon}</div>
                    <CardContent className="flex flex-grow flex-col p-6">
                      <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {translated?.title || tool.title}
                      </h3>
                      <p className="mb-4 flex-grow text-sm text-gray-600 dark:text-gray-400">
                        {translated?.description || tool.description}
                      </p>
                      <div className="mt-auto text-sm font-medium text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                        Open →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
