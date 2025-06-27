"use client";

import dynamic from 'next/dynamic';

const MarkdownEditor = dynamic(
  () => import('@/features/tools/markdown-editor/components/MarkdownEditor.client'),
  { ssr: false }
);

const MarkdownEditorLoader = () => {
  return <MarkdownEditor />;
};

export default MarkdownEditorLoader;
