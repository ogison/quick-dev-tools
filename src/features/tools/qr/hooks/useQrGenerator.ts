import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { workerManager } from '@/lib/worker-manager';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrGeneratorOptions {
  text: string;
  size: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  foregroundColor: string;
  backgroundColor: string;
}

export const useQrGenerator = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>('M');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [qrDataURL, setQrDataURL] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useWebWorker, setUseWebWorker] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fallback: Dynamic import QRCode library for non-worker mode
  const loadQRCodeLibrary = useCallback(async () => {
    try {
      const QRCode = await import('qrcode');
      return QRCode.default;
    } catch (error) {
      toast.error('QRコードライブラリの読み込みに失敗しました');
      throw error;
    }
  }, []);

  // Debounce function
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Generate QR code using Web Worker or fallback
  const generateQrCode = useCallback(async (options: QrGeneratorOptions) => {
    if (!options.text.trim()) {
      setQrDataURL(null);
      return;
    }

    setIsGenerating(true);
    try {
      if (useWebWorker && typeof Worker !== 'undefined') {
        // Use Web Worker for QR generation
        const dataURL = await workerManager.postMessage('qr', 'GENERATE_QR_CANVAS', {
          text: options.text,
          size: options.size,
          errorCorrectionLevel: options.errorCorrectionLevel,
          foregroundColor: options.foregroundColor,
          backgroundColor: options.backgroundColor
        });
        setQrDataURL(dataURL);
      } else {
        // Fallback to main thread
        const QRCode = await loadQRCodeLibrary();
        const canvas = canvasRef.current;
        if (canvas && QRCode) {
          await QRCode.toCanvas(canvas, options.text, {
            width: options.size,
            errorCorrectionLevel: options.errorCorrectionLevel,
            color: {
              dark: options.foregroundColor,
              light: options.backgroundColor,
            },
            margin: 2,
          });
          setQrDataURL(canvas.toDataURL('image/png'));
        }
      }
    } catch (error) {
      console.error('QR Generation error:', error);
      // Try fallback on worker error
      if (useWebWorker) {
        setUseWebWorker(false);
        toast.error('Web Worker使用不可、フォールバックモードで再試行します');
        setTimeout(() => generateQrCode(options), 100);
      } else {
        toast.error('QRコードの生成に失敗しました');
        setQrDataURL(null);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [useWebWorker, loadQRCodeLibrary]);

  // Debounced QR code generation
  const debouncedGenerate = useCallback(
    debounce((options: QrGeneratorOptions) => {
      generateQrCode(options);
    }, 300),
    [generateQrCode]
  );

  // Auto-generate QR code when options change
  useEffect(() => {
    debouncedGenerate({
      text,
      size,
      errorCorrectionLevel,
      foregroundColor,
      backgroundColor,
    });
  }, [text, size, errorCorrectionLevel, foregroundColor, backgroundColor, debouncedGenerate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup any pending timeouts in debounced function
      debouncedGenerate.cancel && debouncedGenerate.cancel();
    };
  }, [debouncedGenerate]);

  // Download QR code as PNG
  const downloadQrCode = useCallback(async () => {
    if (!text.trim()) {
      toast.error('テキストを入力してください');
      return;
    }

    try {
      const QRCode = await loadQRCodeLibrary();
      if (!QRCode) return;
      
      // Generate high-resolution QR code for download
      const dataURL = await QRCode.toDataURL(text, {
        width: size * 2, // Double resolution for better quality
        errorCorrectionLevel,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
        margin: 2,
      });

      // Create download link
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `qrcode-${Date.now()}.png`;
      link.click();

      toast.success('QRコードをダウンロードしました');
    } catch (error) {
      toast.error('ダウンロードに失敗しました');
    }
  }, [text, size, errorCorrectionLevel, foregroundColor, backgroundColor, loadQRCodeLibrary]);

  // Clear all inputs
  const clearAll = () => {
    setText('');
    setSize(256);
    setErrorCorrectionLevel('M');
    setForegroundColor('#000000');
    setBackgroundColor('#ffffff');
  };

  return {
    // State
    text,
    size,
    errorCorrectionLevel,
    foregroundColor,
    backgroundColor,
    qrDataURL,
    isGenerating,
    canvasRef,

    // Setters
    setText,
    setSize,
    setErrorCorrectionLevel,
    setForegroundColor,
    setBackgroundColor,

    // Actions
    downloadQrCode,
    clearAll,
  };
};