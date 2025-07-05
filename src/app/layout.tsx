import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { DefaultSkipLinks } from '@/components/a11y/SkipLink';
import { Footer } from '@/components/Footer';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { PerformanceMonitor } from '@/components/shared/PerformanceMonitor';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://quick-dev-tools.vercel.app'),
  title: {
    default: 'QuickDevTools 開発者ツール集 | プロフェッショナルな無料開発ツール',
    template: '%s | QuickDevTools',
  },
  description:
    'JSON整形、Base64エンコード、URLエンコード、ハッシュ生成など、開発効率を最大化する無料ツールコレクション。ブラウザ上で安全・高速に動作します。',
  keywords: [
    'JSON整形',
    'Base64エンコード',
    'URLエンコード',
    'ハッシュ生成',
    'QRコード生成',
    '正規表現テスト',
    '開発ツール',
    'プログラミング',
    'デベロッパーツール',
    'QuickDevTools',
  ],
  authors: [{ name: 'QuickDevTools' }],
  creator: 'QuickDevTools',
  publisher: 'QuickDevTools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://quick-dev-tools.vercel.app',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://quick-dev-tools.vercel.app',
    title: 'QuickDevTools 開発者ツール集 | プロフェッショナルな無料開発ツール',
    description:
      'JSON整形、Base64エンコード、URLエンコード、ハッシュ生成など、開発効率を最大化する無料ツールコレクション。',
    siteName: 'QuickDevTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickDevTools 開発者ツール集 | プロフェッショナルな無料開発ツール',
    description:
      'JSON整形、Base64エンコード、URLエンコード、ハッシュ生成など、開発効率を最大化する無料ツールコレクション。',
  },
  robots: {
    index: true,
    follow: true,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
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
              '@type': 'WebSite',
              name: 'QuickDevTools',
              alternateName: '開発者ツール集',
              url: 'https://quick-dev-tools.vercel.app',
              description:
                'JSON整形、Base64エンコード、URLエンコード、ハッシュ生成など、開発効率を最大化する無料ツールコレクション。',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate:
                    'https://quick-dev-tools.vercel.app/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
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
      </body>
    </html>
  );
}
