import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  encodeBase64, 
  decodeBase64, 
  generateDataUri, 
  parseDataUri, 
  downloadAsFile, 
  getMimeTypeFromExtension,
  type Base64Encoding,
  type CharacterEncoding
} from '../utils/base64-utils';

export type Base64Mode = 'encode' | 'decode';

export interface FileInfo {
  name: string;
  size: number;
  type: string;
}

export interface Base64Options {
  encoding: Base64Encoding;
  mimeLineBreaks: boolean;
  characterEncoding: CharacterEncoding;
  generateDataUri: boolean;
}

export const useBase64Converter = () => {
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [base64Mode, setBase64Mode] = useState<Base64Mode>('encode');
  const [base64Error, setBase64Error] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [options, setOptions] = useState<Base64Options>({
    encoding: 'standard',
    mimeLineBreaks: false,
    characterEncoding: 'utf-8',
    generateDataUri: false
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    debounce((input: string, mode: Base64Mode, currentOptions: Base64Options) => {
      if (!input.trim()) {
        setBase64Output('');
        setBase64Error('');
        return;
      }

      try {
        if (mode === 'encode') {
          let encoded = encodeBase64(input, {
            encoding: currentOptions.encoding,
            mimeLineBreaks: currentOptions.mimeLineBreaks,
            characterEncoding: currentOptions.characterEncoding
          });

          // Generate data URI if requested and we have file info
          if (currentOptions.generateDataUri && fileInfo) {
            const mimeType = fileInfo.type || getMimeTypeFromExtension(fileInfo.name);
            encoded = generateDataUri(encoded, mimeType);
          }

          setBase64Output(encoded);
        } else {
          // Check if input is a data URI
          const dataUriParsed = parseDataUri(input);
          if (dataUriParsed) {
            const decoded = decodeBase64(dataUriParsed.base64Content, {
              encoding: currentOptions.encoding,
              characterEncoding: currentOptions.characterEncoding,
              outputType: 'text'
            }) as string;
            setBase64Output(decoded);
          } else {
            const decoded = decodeBase64(input, {
              encoding: currentOptions.encoding,
              characterEncoding: currentOptions.characterEncoding,
              outputType: 'text'
            }) as string;
            setBase64Output(decoded);
          }
        }
        setBase64Error('');
      } catch (err) {
        setBase64Error(`無効な${mode === 'encode' ? 'テキスト' : 'Base64'}形式: ${err instanceof Error ? err.message : '不明なエラー'}`);
        setBase64Output('');
      }
    }, 300),
    [fileInfo]
  );

  // Real-time conversion
  useEffect(() => {
    debouncedConvert(base64Input, base64Mode, options);
  }, [base64Input, base64Mode, options, debouncedConvert]);

  const clearAll = () => {
    setBase64Input('');
    setBase64Output('');
    setBase64Error('');
    setFileInfo(null);
    setImagePreview(null);
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
          const encoded = encodeBase64(uint8Array, {
            encoding: options.encoding,
            mimeLineBreaks: options.mimeLineBreaks,
            characterEncoding: options.characterEncoding
          });
          
          // Generate data URI if requested
          if (options.generateDataUri) {
            const mimeType = file.type || getMimeTypeFromExtension(file.name);
            const dataUri = generateDataUri(encoded, mimeType);
            setBase64Output(dataUri);
            
            // Set image preview for image files
            if (file.type.startsWith('image/')) {
              setImagePreview(dataUri);
            }
          } else {
            setBase64Output(encoded);
          }
          
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

  const downloadResult = () => {
    if (!base64Output) return;

    try {
      if (base64Mode === 'decode') {
        // Download decoded result
        const dataUriParsed = parseDataUri(base64Input);
        if (dataUriParsed) {
          // If input was a data URI, download as binary file
          const bytes = decodeBase64(dataUriParsed.base64Content, {
            encoding: options.encoding,
            outputType: 'bytes'
          }) as Uint8Array;
          
          const originalName = fileInfo?.name || 'decoded_file';
          downloadAsFile(bytes, originalName, dataUriParsed.mimeType);
        } else {
          // If input was plain Base64, download as text
          const originalName = fileInfo?.name || 'decoded.txt';
          downloadAsFile(base64Output, originalName, 'text/plain');
        }
        toast.success('ファイルをダウンロードしました');
      } else {
        // Download encoded result as text file
        const filename = fileInfo ? `${fileInfo.name}.base64` : 'encoded.base64';
        downloadAsFile(base64Output, filename, 'text/plain');
        toast.success('Base64ファイルをダウンロードしました');
      }
    } catch (err) {
      toast.error('ダウンロードに失敗しました');
    }
  };

  const updateOptions = (newOptions: Partial<Base64Options>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  };

  return {
    // State
    base64Input,
    base64Output,
    base64Mode,
    base64Error,
    isDragging,
    fileInfo,
    options,
    imagePreview,
    
    // Setters
    setBase64Input,
    setBase64Mode,
    updateOptions,
    
    // Actions
    clearAll,
    copyResult,
    downloadResult,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};