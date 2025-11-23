import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

import { routing } from '@/i18n/routing';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL('https://quick-dev-tools.vercel.app'),
    title: {
      default: t('title'),
      template: '%s | QuickDevTools',
    },
    description: t('description'),
    keywords: t('keywords'),
    authors: [{ name: 'QuickDevTools' }],
    creator: 'QuickDevTools',
    publisher: 'QuickDevTools',
    applicationName: 'QuickDevTools',
    category: 'Developer Tools',
    classification: 'Web Application',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: 'https://quick-dev-tools.vercel.app',
      languages: {
        ja: '/ja',
        en: '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      url: 'https://quick-dev-tools.vercel.app',
      title: t('title'),
      description: t('description'),
      siteName: 'QuickDevTools',
      images: [
        {
          url: '/favicon.png',
          width: 800,
          height: 800,
          alt: 'QuickDevTools Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/favicon.png'],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'kGf0matDnhBKNGaFptGUpEggZz8BX5vWs4-uz3r6_wE',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
        { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: '/manifest.json',
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="QuickDevTools" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://quick-dev-tools.vercel.app/#website',
                  name: 'QuickDevTools',
                  alternateName:
                    locale === 'ja'
                      ? '開発者ツール集'
                      : 'Developer Tools Collection',
                  url: 'https://quick-dev-tools.vercel.app',
                  description:
                    locale === 'ja'
                      ? 'JSON整形、Base64エンコード、URLエンコード、ハッシュ生成など、開発効率を最大化する無料ツールコレクション。'
                      : 'Free developer tools collection to maximize development efficiency including JSON formatter, Base64 encoder, URL encoder, hash generator, and more.',
                  inLanguage: locale === 'ja' ? 'ja-JP' : 'en-US',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: `https://quick-dev-tools.vercel.app/${locale}/search?q={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'WebApplication',
                  '@id': 'https://quick-dev-tools.vercel.app/#webapp',
                  name: 'QuickDevTools',
                  url: 'https://quick-dev-tools.vercel.app',
                  applicationCategory: 'DeveloperApplication',
                  applicationSubCategory: 'Utility',
                  operatingSystem: 'Any',
                  browserRequirements: 'Requires JavaScript. Requires HTML5.',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                  },
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.8',
                    ratingCount: '1000',
                    bestRating: '5',
                    worstRating: '1',
                  },
                },
                {
                  '@type': 'Organization',
                  '@id': 'https://quick-dev-tools.vercel.app/#organization',
                  name: 'QuickDevTools',
                  url: 'https://quick-dev-tools.vercel.app',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://quick-dev-tools.vercel.app/favicon.png',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
