import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

import type { IndentType, JsonFormatterOptions, JsonValidationResult } from '../types';
import {
  validateJson,
  formatJson,
  minifyJson,
  jsonToJavaScript,
  escapeJson,
  unescapeJson,
  getSampleJson,
  copyToClipboard,
  debounce,
} from '../utils/json-formatter';

export const useJsonFormatter = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [validationResult, setValidationResult] = useState<JsonValidationResult>({ isValid: true });
  const [options, setOptions] = useState<JsonFormatterOptions>({
    indentType: 'spaces2',
    indentSize: 2,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [enableVirtualization, setEnableVirtualization] = useState(false);
  const [enableSyntaxHighlight, setEnableSyntaxHighlight] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Debounced validation
  const debouncedValidate = useCallback(
    debounce((input: string) => {
      const result = validateJson(input);
      setValidationResult(result);
    }, 300),
    []
  );

  // Real-time validation
  useEffect(() => {
    debouncedValidate(jsonInput);
    // Enable virtualization for large JSON (> 1MB or > 10000 lines)
    const shouldVirtualize = jsonInput.length > 1024 * 1024 || jsonInput.split('\n').length > 10000;
    setEnableVirtualization(shouldVirtualize);
  }, [jsonInput, debouncedValidate]);

  // Handle indent type change
  const handleIndentTypeChange = (type: IndentType) => {
    setOptions((prev) => ({
      ...prev,
      indentType: type,
      indentSize: type === 'tab' ? 1 : type === 'spaces4' ? 4 : 2,
    }));
  };

  // Format JSON
  const formatJSON = useCallback(() => {
    try {
      const formatted = formatJson(jsonInput, options);
      setJsonOutput(formatted);
      toast.success('JSONを整形しました');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '整形に失敗しました';
      setValidationResult({
        isValid: false,
        error: errorMsg,
      });
      toast.error(`整形エラー: ${errorMsg}`);
    }
  }, [jsonInput, options]);

  // Minify JSON
  const minifyJSON = useCallback(() => {
    try {
      const minified = minifyJson(jsonInput);
      setJsonOutput(minified);
      toast.success('JSONを圧縮しました');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '圧縮に失敗しました';
      setValidationResult({
        isValid: false,
        error: errorMsg,
      });
      toast.error(`圧縮エラー: ${errorMsg}`);
    }
  }, [jsonInput]);

  // Convert to JavaScript
  const convertToJS = useCallback(() => {
    try {
      const jsCode = jsonToJavaScript(jsonInput);
      setJsonOutput(jsCode);
      toast.success('JavaScriptに変換しました');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'JavaScript変換に失敗しました';
      setValidationResult({
        isValid: false,
        error: errorMsg,
      });
      toast.error(`変換エラー: ${errorMsg}`);
    }
  }, [jsonInput]);

  // Escape JSON
  const escapeJSON = useCallback(() => {
    const escaped = escapeJson(jsonInput);
    setJsonOutput(escaped);
    toast.success('JSONをエスケープしました');
  }, [jsonInput]);

  // Unescape JSON
  const unescapeJSON = useCallback(() => {
    const unescaped = unescapeJson(jsonInput);
    setJsonOutput(unescaped);
    toast.success('JSONをアンエスケープしました');
  }, [jsonInput]);

  // Load sample JSON
  const loadSample = useCallback(() => {
    const sample = getSampleJson();
    setJsonInput(sample);
    toast.success('サンプルJSONを読み込みました');
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setJsonInput('');
    setJsonOutput('');
    setValidationResult({ isValid: true });
    toast.success('すべてクリアしました');
  }, []);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!jsonOutput.trim()) {
      toast.error('コピーする内容がありません');
      return;
    }

    const success = await copyToClipboard(jsonOutput);
    if (success) {
      toast.success('クリップボードにコピーしました');
    } else {
      toast.error('コピーに失敗しました');
    }
  }, [jsonOutput]);

  // File drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(
      (file) =>
        file.type === 'application/json' ||
        file.name.endsWith('.json') ||
        file.type === 'text/plain'
    );

    if (!jsonFile) {
      toast.error('JSONファイルを選択してください');
      return;
    }

    if (jsonFile.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error('ファイルサイズが10MBを超えています');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      toast.success(`ファイル "${jsonFile.name}" を読み込みました`);
    };
    reader.onerror = () => {
      toast.error('ファイルの読み込みに失敗しました');
    };
    reader.readAsText(jsonFile);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'f':
          case 'F':
            e.preventDefault();
            if (validationResult.isValid && jsonInput.trim()) {
              formatJSON();
            }
            break;
          case 'm':
          case 'M':
            e.preventDefault();
            if (validationResult.isValid && jsonInput.trim()) {
              minifyJSON();
            }
            break;
          case 'l':
          case 'L':
            e.preventDefault();
            clearAll();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [validationResult.isValid, jsonInput, formatJSON, minifyJSON, clearAll]);

  return {
    // State
    jsonInput,
    jsonOutput,
    validationResult,
    options,
    isDragging,
    enableVirtualization,
    enableSyntaxHighlight,
    inputRef,
    outputRef,

    // Setters
    setJsonInput,
    handleIndentTypeChange,
    setEnableSyntaxHighlight,

    // Actions
    formatJSON,
    minifyJSON,
    convertToJS,
    escapeJSON,
    unescapeJSON,
    loadSample,
    clearAll,
    handleCopy,

    // Drag and drop
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};
