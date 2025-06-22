'use client';

import { useState, useCallback } from 'react';

interface UseCopyToClipboardReturn {
  copied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
  copyState: { [key: string]: boolean };
  copyWithKey: (text: string, key: string) => Promise<void>;
}

export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);
  const [copyState, setCopyState] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  }, []);

  const copyWithKey = useCallback(async (text: string, key: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopyState((prev) => ({ ...prev, [key]: true }));
        setTimeout(() => {
          setCopyState((prev) => ({ ...prev, [key]: false }));
        }, 2000);
      }
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  }, []);

  return {
    copied,
    copyToClipboard,
    copyState,
    copyWithKey,
  };
}
