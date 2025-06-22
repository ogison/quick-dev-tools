'use client';

import { useEffect, useState, useRef } from 'react';

import type { UrlMode } from '../types';
import { highlightErrors, validateEncodedString, validateUrl } from '../utils/error-highlighter';

interface ErrorHighlightedInputProps {
  value: string;
  onChange: (value: string) => void;
  mode: UrlMode;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

export function ErrorHighlightedInput({
  value,
  onChange,
  mode,
  placeholder,
  className = '',
  ...ariaProps
}: ErrorHighlightedInputProps) {
  const [highlightedContent, setHighlightedContent] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const highlighted = highlightErrors(value, mode);
      setHighlightedContent(highlighted);

      // エラーチェック
      const errors = mode === 'encode' ? validateUrl(value) : validateEncodedString(value);
      setHasErrors(errors.length > 0);
    } else {
      setHighlightedContent('');
      setHasErrors(false);
    }
  }, [value, mode]);

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Background highlighting */}
      <div
        ref={highlightRef}
        className="error-syntax pointer-events-none absolute inset-0 overflow-hidden p-3 font-mono text-sm break-words whitespace-pre-wrap text-transparent"
        style={{ zIndex: 1 }}
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
      />

      {/* Input textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        placeholder={placeholder}
        className={`relative h-64 w-full resize-none rounded-md border bg-transparent p-3 font-mono text-sm ${
          hasErrors ? 'border-destructive' : 'border-input'
        } focus:ring-ring focus:border-transparent focus:ring-2`}
        style={{ zIndex: 2 }}
        {...ariaProps}
      />

      <style jsx>{`
        .error-syntax :global(.error-highlight) {
          background-color: var(--error-bg, #fecaca);
          color: var(--error-color, #dc2626);
          text-decoration: underline;
          text-decoration-style: wavy;
          text-decoration-color: var(--error-color, #dc2626);
        }
        .error-syntax :global(.warning-highlight) {
          background-color: var(--warning-bg, #fef3c7);
          color: var(--warning-color, #d97706);
        }
        .error-syntax :global(.normal-text) {
          color: transparent;
        }

        @media (prefers-color-scheme: dark) {
          .error-syntax :global(.error-highlight) {
            background-color: var(--error-bg-dark, #7f1d1d);
            color: var(--error-color-dark, #fca5a5);
          }
          .error-syntax :global(.warning-highlight) {
            background-color: var(--warning-bg-dark, #78350f);
            color: var(--warning-color-dark, #fcd34d);
          }
        }

        :global(.dark) .error-syntax :global(.error-highlight) {
          background-color: var(--error-bg-dark, #7f1d1d);
          color: var(--error-color-dark, #fca5a5);
        }
        :global(.dark) .error-syntax :global(.warning-highlight) {
          background-color: var(--warning-bg-dark, #78350f);
          color: var(--warning-color-dark, #fcd34d);
        }
      `}</style>
    </div>
  );
}
