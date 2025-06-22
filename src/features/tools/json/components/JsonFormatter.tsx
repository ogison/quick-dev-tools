'use client';

import { useJsonFormatter } from '../hooks/useJsonFormatter';
import type { IndentType } from '../types';

export default function JsonFormatter() {
  const {
    jsonInput,
    jsonOutput,
    validationResult,
    options,
    isDragging,
    inputRef,
    outputRef,
    setJsonInput,
    handleIndentTypeChange,
    formatJSON,
    minifyJSON,
    convertToJS,
    escapeJSON,
    unescapeJSON,
    loadSample,
    clearAll,
    handleCopy,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useJsonFormatter();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">JSON整形・検証</h2>
      <p className="text-gray-600 mb-6">JSONデータの整形、検証、変換を行うツールです</p>
      
      {/* Keyboard shortcuts help */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>キーボードショートカット:</strong> 
          <span className="ml-2">Ctrl+F (整形) • Ctrl+M (圧縮) • Ctrl+L (クリア)</span>
        </p>
      </div>

      {/* Options Toolbar */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">インデント:</label>
            <select
              value={options.indentType}
              onChange={(e) => handleIndentTypeChange(e.target.value as IndentType)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="インデントタイプを選択"
            >
              <option value="spaces2">2スペース</option>
              <option value="spaces4">4スペース</option>
              <option value="tab">タブ</option>
            </select>
          </div>
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            aria-label="サンプルJSONを読み込み"
          >
            サンプル読み込み
          </button>
        </div>
      </div>

      {/* Input/Output Areas */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="json-input">
              入力JSON
              <span className="text-xs text-gray-500 ml-2">（ファイルをドラッグ&ドロップも可能）</span>
            </label>
            {!validationResult.isValid && validationResult.line && (
              <span className="text-xs text-red-600" role="alert">
                {validationResult.line}行目
                {validationResult.column && ` ${validationResult.column}列目`}
              </span>
            )}
          </div>
          <div
            className="relative"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <textarea
              id="json-input"
              ref={inputRef}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="JSONデータを入力、またはJSONファイルをドラッグ&ドロップしてください..."
              className={`w-full h-64 p-3 border rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                !validationResult.isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${
                isDragging ? 'border-blue-400 bg-blue-50' : ''
              }`}
              aria-invalid={!validationResult.isValid}
              aria-describedby={!validationResult.isValid ? 'json-error' : undefined}
            />
            {isDragging && (
              <div className="absolute inset-0 bg-blue-100 bg-opacity-75 border-2 border-dashed border-blue-400 rounded-md flex items-center justify-center">
                <div className="text-blue-600 font-medium">
                  JSONファイルをここにドロップしてください
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="json-output">
              出力結果
            </label>
            {jsonOutput && (
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-sm rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                aria-label="出力結果をクリップボードにコピー"
              >
                コピー
              </button>
            )}
          </div>
          <textarea
            id="json-output"
            ref={outputRef}
            value={jsonOutput}
            readOnly
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
            placeholder="整形されたJSONがここに表示されます..."
            aria-label="整形されたJSON出力結果"
          />
        </div>
      </div>

      {/* Error Display */}
      {!validationResult.isValid && validationResult.error && (
        <div id="json-error" className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
          <strong>エラー:</strong> {validationResult.error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button 
          onClick={formatJSON} 
          disabled={!validationResult.isValid || !jsonInput.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          aria-describedby="format-help"
          title="Ctrl+F"
        >
          整形
        </button>
        <button 
          onClick={minifyJSON}
          disabled={!validationResult.isValid || !jsonInput.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          title="Ctrl+M"
        >
          圧縮
        </button>
        <button 
          onClick={convertToJS}
          disabled={!validationResult.isValid || !jsonInput.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          aria-label="JSONをJavaScriptオブジェクトに変換"
        >
          JavaScript変換
        </button>
        <button 
          onClick={escapeJSON}
          disabled={!jsonInput.trim()}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          aria-label="JSON文字列をエスケープ"
        >
          エスケープ
        </button>
        <button 
          onClick={unescapeJSON}
          disabled={!jsonInput.trim()}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          aria-label="エスケープされたJSON文字列を元に戻す"
        >
          アンエスケープ
        </button>
        <button 
          onClick={clearAll}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          title="Ctrl+L"
          aria-label="入力と出力をすべてクリア"
        >
          すべてクリア
        </button>
      </div>
    </div>
  );
}