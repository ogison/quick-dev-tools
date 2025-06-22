import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export type Base64Mode = 'encode' | 'decode';

export interface FileInfo {
  name: string;
  size: number;
  type: string;
}

export const useBase64Converter = () => {
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [base64Mode, setBase64Mode] = useState<Base64Mode>('encode');
  const [base64Error, setBase64Error] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  // Debounce function
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Debounced conversion function
  const debouncedConvert = useCallback(
    debounce((input: string, mode: Base64Mode) => {
      if (!input.trim()) {
        setBase64Output('');
        setBase64Error('');
        return;
      }

      try {
        if (mode === 'encode') {
          if (typeof btoa === 'undefined') {
            return;
          }
          const encoded = btoa(unescape(encodeURIComponent(input)));
          setBase64Output(encoded);
        } else {
          if (typeof atob === 'undefined') {
            return;
          }
          const decoded = decodeURIComponent(escape(atob(input)));
          setBase64Output(decoded);
        }
        setBase64Error('');
      } catch (err) {
        setBase64Error(`無効な${mode === 'encode' ? 'テキスト' : 'Base64'}形式: ${err instanceof Error ? err.message : '不明なエラー'}`);
        setBase64Output('');
      }
    }, 300),
    []
  );

  // Real-time conversion
  useEffect(() => {
    debouncedConvert(base64Input, base64Mode);
  }, [base64Input, base64Mode, debouncedConvert]);

  const clearAll = () => {
    setBase64Input('');
    setBase64Output('');
    setBase64Error('');
    setFileInfo(null);
  };

  const copyResult = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(base64Output);
        toast.success('結果をクリップボードにコピーしました');
      } else {
        toast.error('クリップボードへのコピーがサポートされていません');
      }
    } catch (err) {
      toast.error('コピーに失敗しました');
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('ファイルサイズが10MBを超えています');
      return;
    }

    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type
    });

    const reader = new FileReader();
    
    if (base64Mode === 'encode') {
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          // For text files
          setBase64Input(result);
        } else if (result instanceof ArrayBuffer) {
          // For binary files
          const uint8Array = new Uint8Array(result);
          const binaryString = Array.from(uint8Array)
            .map(byte => String.fromCharCode(byte))
            .join('');
          const base64 = btoa(binaryString);
          setBase64Output(base64);
          setBase64Input(''); // Clear text input for file upload
        }
        toast.success('ファイルが読み込まれました');
      };

      reader.onerror = () => {
        toast.error('ファイルの読み込みに失敗しました');
      };

      // Try to read as text first, fallback to binary for non-text files
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        reader.readAsText(file, 'UTF-8');
      } else {
        reader.readAsArrayBuffer(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return {
    // State
    base64Input,
    base64Output,
    base64Mode,
    base64Error,
    isDragging,
    fileInfo,
    
    // Setters
    setBase64Input,
    setBase64Mode,
    
    // Actions
    clearAll,
    copyResult,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};