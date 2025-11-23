import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { DefaultSkipLinks } from '@/components/a11y/SkipLink';
import { Footer } from '@/components/Footer';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { PerformanceMonitor } from '@/components/shared/PerformanceMonitor';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'ja' | 'en')) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="engineer-tools-theme"
      >
        <DefaultSkipLinks />
        <Header />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
        <PerformanceMonitor />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
