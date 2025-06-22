import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { DefaultSkipLinks } from "@/components/a11y/SkipLink";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: '開発者ツール集 | プロフェッショナルな無料開発ツール',
    template: '%s | 開発者ツール集',
  },
  description: 'JSON整形、Base64エンコード、URLエンコード、ハッシュ生成など、開発効率を最大化する無料ツールコレクション。ブラウザ上で安全・高速に動作します。',
  keywords: ['JSON整形', 'Base64エンコード', 'URLエンコード', 'ハッシュ生成', 'QRコード生成', '正規表現テスト', '開発ツール', 'プログラミング', 'デベロッパーツール'],
  authors: [{ name: '開発者ツール集' }],
  creator: '開発者ツール集',
  publisher: '開発者ツール集',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    title: '開発者ツール集 | プロフェッショナルな無料開発ツール',
    description: 'JSON整形、Base64エンコード、URLエンコード、ハッシュ生成など、開発効率を最大化する無料ツールコレクション。',
    siteName: '開発者ツール集',
  },
  twitter: {
    card: 'summary_large_image',
    title: '開発者ツール集 | プロフェッショナルな無料開発ツール',
    description: 'JSON整形、Base64エンコード、URLエンコード、ハッシュ生成など、開発効率を最大化する無料ツールコレクション。',
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
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
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
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
