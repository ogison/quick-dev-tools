'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { VariableSizeList as List } from 'react-window';

import { highlightJSON } from '../utils/syntax-highlighter';

interface VirtualizedTextAreaProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  lineNumbers?: boolean;
  syntaxHighlight?: boolean;
  'aria-label'?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

interface LineData {
  index: number;
  text: string;
  height: number;
}

const LINE_HEIGHT = 20;
const MAX_LINE_LENGTH = 1000;

export function VirtualizedTextArea({
  value,
  onChange,
  readOnly = false,
  placeholder,
  className = '',
  lineNumbers = false,
  syntaxHighlight = false,
  ...ariaProps
}: VirtualizedTextAreaProps) {
  const [lines, setLines] = useState<LineData[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  const itemHeights = useRef<{ [key: number]: number }>({});

  // Parse value into lines
  useEffect(() => {
    const textLines = value.split('\n');
    const lineData: LineData[] = textLines.map((text, index) => ({
      index,
      text: text.length > MAX_LINE_LENGTH ? text.slice(0, MAX_LINE_LENGTH) + '...' : text,
      height: LINE_HEIGHT,
    }));
    setLines(lineData);
  }, [value]);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Get item height
  const getItemSize = useCallback((index: number) => {
    return itemHeights.current[index] || LINE_HEIGHT;
  }, []);

  // Set item height
  const setItemSize = useCallback((index: number, size: number) => {
    itemHeights.current[index] = size;
    if (listRef.current) {
      listRef.current.resetAfterIndex(index);
    }
  }, []);

  // Render a single line
  const renderLine = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const line = lines[index];
      if (!line) {
        return null;
      }

      const lineNumberWidth = lineNumbers ? 50 : 0;

      return (
        <div
          style={style}
          className="flex font-mono text-sm"
          onLoad={(e) => {
            const height = (e.target as HTMLDivElement).getBoundingClientRect().height;
            if (height !== itemHeights.current[index]) {
              setItemSize(index, height);
            }
          }}
        >
          {lineNumbers && (
            <span
              className="text-muted-foreground bg-muted/30 inline-block w-[50px] px-2 text-right select-none"
              style={{ minWidth: lineNumberWidth }}
            >
              {index + 1}
            </span>
          )}
          {syntaxHighlight ? (
            <pre
              className="json-syntax m-0 flex-1 px-3"
              style={{ minHeight: LINE_HEIGHT }}
              dangerouslySetInnerHTML={{
                __html: highlightJSON(line.text || ' '),
              }}
            />
          ) : (
            <pre className="m-0 flex-1 px-3" style={{ minHeight: LINE_HEIGHT }}>
              {line.text || ' '}
            </pre>
          )}
        </div>
      );
    },
    [lines, lineNumbers, syntaxHighlight, setItemSize]
  );

  // Handle text area behavior for editing
  if (!readOnly && onChange) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        {...ariaProps}
      />
    );
  }

  // Virtualized read-only display
  return (
    <div ref={containerRef} className={`${className} overflow-hidden`} {...ariaProps}>
      {lines.length === 0 && placeholder && (
        <div className="text-muted-foreground p-3">{placeholder}</div>
      )}
      {lines.length > 0 && (
        <List
          ref={listRef}
          height={dimensions.height}
          width={dimensions.width}
          itemCount={lines.length}
          itemSize={getItemSize}
          overscanCount={10}
        >
          {renderLine}
        </List>
      )}
      {syntaxHighlight && (
        <style jsx>{`
          :global(.json-syntax .json-string) {
            color: var(--json-string-color, #22863a);
          }
          :global(.json-syntax .json-number) {
            color: var(--json-number-color, #005cc5);
          }
          :global(.json-syntax .json-boolean) {
            color: var(--json-boolean-color, #d73a49);
          }
          :global(.json-syntax .json-null) {
            color: var(--json-null-color, #6f42c1);
          }
          :global(.json-syntax .json-key) {
            color: var(--json-key-color, #d73a49);
            font-weight: 600;
          }
          :global(.json-syntax .json-punctuation) {
            color: var(--json-punctuation-color, #586069);
          }

          @media (prefers-color-scheme: dark) {
            :global(.json-syntax .json-string) {
              color: var(--json-string-color-dark, #85e89d);
            }
            :global(.json-syntax .json-number) {
              color: var(--json-number-color-dark, #79b8ff);
            }
            :global(.json-syntax .json-boolean) {
              color: var(--json-boolean-color-dark, #f97583);
            }
            :global(.json-syntax .json-null) {
              color: var(--json-null-color-dark, #b392f0);
            }
            :global(.json-syntax .json-key) {
              color: var(--json-key-color-dark, #f97583);
            }
            :global(.json-syntax .json-punctuation) {
              color: var(--json-punctuation-color-dark, #959da5);
            }
          }

          :global(.dark) :global(.json-syntax .json-string) {
            color: var(--json-string-color-dark, #85e89d);
          }
          :global(.dark) :global(.json-syntax .json-number) {
            color: var(--json-number-color-dark, #79b8ff);
          }
          :global(.dark) :global(.json-syntax .json-boolean) {
            color: var(--json-boolean-color-dark, #f97583);
          }
          :global(.dark) :global(.json-syntax .json-null) {
            color: var(--json-null-color-dark, #b392f0);
          }
          :global(.dark) :global(.json-syntax .json-key) {
            color: var(--json-key-color-dark, #f97583);
          }
          :global(.dark) :global(.json-syntax .json-punctuation) {
            color: var(--json-punctuation-color-dark, #959da5);
          }
        `}</style>
      )}
    </div>
  );
}
