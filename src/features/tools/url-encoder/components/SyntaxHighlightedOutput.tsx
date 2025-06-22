'use client';

import { useEffect, useState } from 'react';

import type { UrlMode } from '../types';
import { highlightUrl, highlightEncodedString } from '../utils/url-highlighter';

interface SyntaxHighlightedOutputProps {
  text: string;
  mode: UrlMode;
  className?: string;
  'aria-label'?: string;
}

export function SyntaxHighlightedOutput({
  text,
  mode,
  className = '',
  ...ariaProps
}: SyntaxHighlightedOutputProps) {
  const [highlightedContent, setHighlightedContent] = useState('');

  useEffect(() => {
    if (text) {
      const highlighted = mode === 'encode' ? highlightEncodedString(text) : highlightUrl(text);
      setHighlightedContent(highlighted);
    } else {
      setHighlightedContent('');
    }
  }, [text, mode]);

  if (!text) {
    return (
      <div className={`${className} text-muted-foreground p-3`} {...ariaProps}>
        {mode === 'encode' ? 'エンコード' : 'デコード'}されたテキストがここに表示されます...
      </div>
    );
  }

  return (
    <div className={`${className} relative`} {...ariaProps}>
      <pre
        className="url-syntax m-0 p-3 font-mono text-sm whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
      />
      <style jsx>{`
        .url-syntax :global(.url-protocol) {
          color: var(--url-protocol-color, #0969da);
          font-weight: 600;
        }
        .url-syntax :global(.url-hostname) {
          color: var(--url-hostname-color, #8250df);
          font-weight: 500;
        }
        .url-syntax :global(.url-port) {
          color: var(--url-port-color, #cf222e);
        }
        .url-syntax :global(.url-pathname) {
          color: var(--url-pathname-color, #1f883d);
        }
        .url-syntax :global(.url-search) {
          color: var(--url-search-color, #bf8700);
        }
        .url-syntax :global(.url-hash) {
          color: var(--url-hash-color, #bc4c00);
        }
        .url-syntax :global(.url-encoded) {
          background-color: var(--url-encoded-bg, #fff8c5);
          color: var(--url-encoded-color, #633c01);
          padding: 0 2px;
          border-radius: 3px;
          font-weight: 500;
        }
        .url-syntax :global(.url-text) {
          color: var(--url-text-color, inherit);
        }

        @media (prefers-color-scheme: dark) {
          .url-syntax :global(.url-protocol) {
            color: var(--url-protocol-color-dark, #58a6ff);
          }
          .url-syntax :global(.url-hostname) {
            color: var(--url-hostname-color-dark, #a5a5ff);
          }
          .url-syntax :global(.url-port) {
            color: var(--url-port-color-dark, #ff7b72);
          }
          .url-syntax :global(.url-pathname) {
            color: var(--url-pathname-color-dark, #7ee787);
          }
          .url-syntax :global(.url-search) {
            color: var(--url-search-color-dark, #f2cc60);
          }
          .url-syntax :global(.url-hash) {
            color: var(--url-hash-color-dark, #ffa657);
          }
          .url-syntax :global(.url-encoded) {
            background-color: var(--url-encoded-bg-dark, #6e570a);
            color: var(--url-encoded-color-dark, #f2cc60);
          }
        }

        :global(.dark) .url-syntax :global(.url-protocol) {
          color: var(--url-protocol-color-dark, #58a6ff);
        }
        :global(.dark) .url-syntax :global(.url-hostname) {
          color: var(--url-hostname-color-dark, #a5a5ff);
        }
        :global(.dark) .url-syntax :global(.url-port) {
          color: var(--url-port-color-dark, #ff7b72);
        }
        :global(.dark) .url-syntax :global(.url-pathname) {
          color: var(--url-pathname-color-dark, #7ee787);
        }
        :global(.dark) .url-syntax :global(.url-search) {
          color: var(--url-search-color-dark, #f2cc60);
        }
        :global(.dark) .url-syntax :global(.url-hash) {
          color: var(--url-hash-color-dark, #ffa657);
        }
        :global(.dark) .url-syntax :global(.url-encoded) {
          background-color: var(--url-encoded-bg-dark, #6e570a);
          color: var(--url-encoded-color-dark, #f2cc60);
        }
      `}</style>
    </div>
  );
}
