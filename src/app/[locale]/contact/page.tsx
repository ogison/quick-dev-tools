import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ContactForm from '@/features/contact/components/ContactForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  const title = `${t('title')} | QuickDevTools`;
  const description = t('description');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://quick-dev-tools.vercel.app/${locale}/contact`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://quick-dev-tools.vercel.app/${locale}/contact`,
      languages: {
        ja: 'https://quick-dev-tools.vercel.app/ja/contact',
        en: 'https://quick-dev-tools.vercel.app/en/contact',
      },
    },
  };
}

export default function ContactPage() {
  return <ContactForm />;
}
