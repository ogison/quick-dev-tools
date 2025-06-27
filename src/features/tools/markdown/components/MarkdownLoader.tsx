"use client";

import dynamic from 'next/dynamic';

const MarkdownPreview = dynamic(
  () => import('@/features/tools/markdown/components/MarkdownPreview.client'),
  { ssr: false }
);

const MarkdownLoader = () => {
  return <MarkdownPreview />;
};

export default MarkdownLoader;
