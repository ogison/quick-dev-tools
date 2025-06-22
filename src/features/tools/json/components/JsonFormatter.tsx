'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  validateJson, 
  formatJson, 
  minifyJson,
  jsonToJavaScript,
  escapeJson,
  unescapeJson,
  getSampleJson,
  copyToClipboard,
  debounce
} from '../utils/json-formatter';
import type { IndentType, JsonFormatterOptions, JsonValidationResult } from '../types';

export default function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [validationResult, setValidationResult] = useState<JsonValidationResult>({ isValid: true });
  const [copySuccess, setCopySuccess] = useState(false);
  const [options, setOptions] = useState<JsonFormatterOptions>({
    indentType: 'spaces2',
    indentSize: 2
  });

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
  }, [jsonInput, debouncedValidate]);

  const handleIndentTypeChange = (type: IndentType) => {
    setOptions(prev => ({
      ...prev,
      indentType: type,
      indentSize: type === 'tab' ? 1 : type === 'spaces4' ? 4 : 2
    }));
  };

  const formatJSON = () => {
    try {
      const formatted = formatJson(jsonInput, options);
      setJsonOutput(formatted);
    } catch (error) {
      setValidationResult({
        isValid: false,
        error: error instanceof Error ? error.message : '整形に失敗しました'
      });
    }
  };

  const minifyJSON = () => {
    try {
      const minified = minifyJson(jsonInput);
      setJsonOutput(minified);
    } catch (error) {
      setValidationResult({
        isValid: false,
        error: error instanceof Error ? error.message : '圧縮に失敗しました'
      });
    }
  };

  const convertToJS = () => {
    try {
      const jsCode = jsonToJavaScript(jsonInput);
      setJsonOutput(jsCode);
    } catch (error) {
      setValidationResult({
        isValid: false,
        error: error instanceof Error ? error.message : 'JavaScript変換に失敗しました'
      });
    }
  };

  const escapeJSON = () => {
    const escaped = escapeJson(jsonInput);
    setJsonOutput(escaped);
  };

  const unescapeJSON = () => {
    const unescaped = unescapeJson(jsonInput);
    setJsonOutput(unescaped);
  };

  const loadSample = () => {
    const sample = getSampleJson();
    setJsonInput(sample);
  };

  const clearAll = () => {
    setJsonInput('');
    setJsonOutput('');
    setValidationResult({ isValid: true });
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(jsonOutput);
    setCopySuccess(success);
    if (success) {
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">JSON整形・検証</h2>
      <p className="text-gray-600 mb-6">JSONデータの整形、検証、変換を行うツールです</p>

      {/* Options Toolbar */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">インデント:</label>
            <select
              value={options.indentType}
              onChange={(e) => handleIndentTypeChange(e.target.value as IndentType)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="spaces2">2スペース</option>
              <option value="spaces4">4スペース</option>
              <option value="tab">タブ</option>
            </select>
          </div>
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            サンプル読み込み
          </button>
        </div>
      </div>

      {/* Input/Output Areas */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              入力JSON
            </label>
            {!validationResult.isValid && validationResult.line && (
              <span className="text-xs text-red-600">
                {validationResult.line}行目
                {validationResult.column && ` ${validationResult.column}列目`}
              </span>
            )}
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="JSONデータを入力してください..."
            className={`w-full h-64 p-3 border rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              !validationResult.isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              出力結果
            </label>
            {jsonOutput && (
              <button
                onClick={handleCopy}
                className={`px-3 py-1 text-sm rounded ${
                  copySuccess 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {copySuccess ? 'コピー完了!' : 'コピー'}
              </button>
            )}
          </div>
          <textarea
            value={jsonOutput}
            readOnly
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
            placeholder="整形されたJSONがここに表示されます..."
          />
        </div>
      </div>

      {/* Error Display */}
      {!validationResult.isValid && validationResult.error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>エラー:</strong> {validationResult.error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button 
          onClick={formatJSON} 
          disabled={!validationResult.isValid || !jsonInput.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          整形
        </button>
        <button 
          onClick={minifyJSON}
          disabled={!validationResult.isValid || !jsonInput.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          圧縮
        </button>
        <button 
          onClick={convertToJS}
          disabled={!validationResult.isValid || !jsonInput.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          JavaScript変換
        </button>
        <button 
          onClick={escapeJSON}
          disabled={!jsonInput.trim()}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          エスケープ
        </button>
        <button 
          onClick={unescapeJSON}
          disabled={!jsonInput.trim()}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          アンエスケープ
        </button>
        <button 
          onClick={clearAll}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          すべてクリア
        </button>
      </div>
    </div>
  );
}