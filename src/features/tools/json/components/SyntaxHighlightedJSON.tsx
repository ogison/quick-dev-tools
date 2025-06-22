'use client';

import { useEffect, useRef, useState } from 'react';

import { highlightJSON } from '../utils/syntax-highlighter';

interface SyntaxHighlightedJSONProps {
  json: string;
  className?: string;
  lineNumbers?: boolean;
  'aria-label'?: string;
}

export function SyntaxHighlightedJSON({
  json,
  className = '',
  lineNumbers = false,
  ...ariaProps
}: SyntaxHighlightedJSONProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightedContent, setHighlightedContent] = useState('');

  useEffect(() => {
    if (json) {
      const highlighted = highlightJSON(json);
      setHighlightedContent(highlighted);
    }
  }, [json]);

  const lines = json.split('\n');

  return (
    <div ref={containerRef} className={`${className} flex overflow-auto`} {...ariaProps}>
      {lineNumbers && (
        <div className="text-muted-foreground bg-muted/30 text-right select-none">
          {lines.map((_, index) => (
            <div key={index} className="px-2 font-mono text-sm leading-5">
              {index + 1}
            </div>
          ))}
        </div>
      )}
      <pre
        className="json-syntax m-0 flex-1 p-3 font-mono text-sm"
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
      />
      <style jsx>{`
        .json-syntax :global(.json-string) {
          color: var(--json-string-color, #22863a);
        }
        .json-syntax :global(.json-number) {
          color: var(--json-number-color, #005cc5);
        }
        .json-syntax :global(.json-boolean) {
          color: var(--json-boolean-color, #d73a49);
        }
        .json-syntax :global(.json-null) {
          color: var(--json-null-color, #6f42c1);
        }
        .json-syntax :global(.json-key) {
          color: var(--json-key-color, #d73a49);
          font-weight: 600;
        }
        .json-syntax :global(.json-punctuation) {
          color: var(--json-punctuation-color, #586069);
        }

        @media (prefers-color-scheme: dark) {
          .json-syntax :global(.json-string) {
            color: var(--json-string-color-dark, #85e89d);
          }
          .json-syntax :global(.json-number) {
            color: var(--json-number-color-dark, #79b8ff);
          }
          .json-syntax :global(.json-boolean) {
            color: var(--json-boolean-color-dark, #f97583);
          }
          .json-syntax :global(.json-null) {
            color: var(--json-null-color-dark, #b392f0);
          }
          .json-syntax :global(.json-key) {
            color: var(--json-key-color-dark, #f97583);
          }
          .json-syntax :global(.json-punctuation) {
            color: var(--json-punctuation-color-dark, #959da5);
          }
        }

        :global(.dark) .json-syntax :global(.json-string) {
          color: var(--json-string-color-dark, #85e89d);
        }
        :global(.dark) .json-syntax :global(.json-number) {
          color: var(--json-number-color-dark, #79b8ff);
        }
        :global(.dark) .json-syntax :global(.json-boolean) {
          color: var(--json-boolean-color-dark, #f97583);
        }
        :global(.dark) .json-syntax :global(.json-null) {
          color: var(--json-null-color-dark, #b392f0);
        }
        :global(.dark) .json-syntax :global(.json-key) {
          color: var(--json-key-color-dark, #f97583);
        }
        :global(.dark) .json-syntax :global(.json-punctuation) {
          color: var(--json-punctuation-color-dark, #959da5);
        }
      `}</style>
    </div>
  );
}
