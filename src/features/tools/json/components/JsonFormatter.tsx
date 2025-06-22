'use client';

import { useJsonFormatter } from '../hooks/useJsonFormatter';
import { VirtualizedTextArea } from './VirtualizedTextArea';
import { SyntaxHighlightedJSON } from './SyntaxHighlightedJSON';
import type { IndentType } from '../types';

export default function JsonFormatter() {
  const {
    jsonInput,
    jsonOutput,
    validationResult,
    options,
    isDragging,
    enableVirtualization,
    enableSyntaxHighlight,
    inputRef,
    outputRef,
    setJsonInput,
    handleIndentTypeChange,
    setEnableSyntaxHighlight,
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
      <h2 className="text-2xl font-semibold mb-2">JSON整形・検証</h2>
      <p className="text-muted-foreground mb-6">JSONデータの整形、検証、変換を行うツールです</p>

      {/* Keyboard shortcuts help */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>キーボードショートカット:</strong> 
          <span className="ml-2">Ctrl+F (整形) • Ctrl+M (圧縮) • Ctrl+L (クリア)</span>
        </p>
        {enableVirtualization && (
          <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
            <strong>仮想スクロール有効:</strong> 大容量JSONのため高速表示モードが有効になっています
          </p>
        )}
      </div>

      {/* Options Toolbar */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">インデント:</label>
            <select
              value={options.indentType}
              onChange={(e) => handleIndentTypeChange(e.target.value as IndentType)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
              aria-label="インデントタイプを選択"
            >
              <option value="spaces2">2スペース</option>
              <option value="spaces4">4スペース</option>
              <option value="tab">タブ</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">シンタックスハイライト:</label>
            <input
              type="checkbox"
              checked={enableSyntaxHighlight}
              onChange={(e) => setEnableSyntaxHighlight(e.target.checked)}
              className="rounded focus:ring-2 focus:ring-ring"
              aria-label="シンタックスハイライトを有効化"
            />
          </div>
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
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
            <label className="block text-sm font-medium" htmlFor="json-input">
              入力JSON
              <span className="text-xs text-muted-foreground ml-2">（ファイルをドラッグ&ドロップも可能）</span>
            </label>
            {!validationResult.isValid && validationResult.line && (
              <span className="text-xs text-destructive" role="alert">
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
              className={`w-full h-64 p-3 border rounded-md font-mono text-sm bg-background focus:ring-2 focus:ring-ring focus:border-transparent transition-colors ${
                !validationResult.isValid ? 'border-destructive bg-destructive/10' : 'border-input'
              } ${
                isDragging ? 'border-primary bg-primary/10' : ''
              }`}
              aria-invalid={!validationResult.isValid}
              aria-describedby={!validationResult.isValid ? 'json-error' : undefined}
            />
            {isDragging && (
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm border-2 border-dashed border-primary rounded-md flex items-center justify-center">
                <div className="text-primary font-medium">
                  JSONファイルをここにドロップしてください
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium" htmlFor="json-output">
              出力結果
            </label>
            {jsonOutput && (
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-sm rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                aria-label="出力結果をクリップボードにコピー"
              >
                コピー
              </button>
            )}
          </div>
          {enableVirtualization && jsonOutput ? (
            <VirtualizedTextArea
              value={jsonOutput}
              readOnly
              className="w-full h-64 border border-input rounded-md bg-muted/50"
              placeholder="整形されたJSONがここに表示されます..."
              aria-label="整形されたJSON出力結果"
              lineNumbers={true}
              syntaxHighlight={enableSyntaxHighlight}
            />
          ) : enableSyntaxHighlight && jsonOutput && validationResult.isValid ? (
            <SyntaxHighlightedJSON
              json={jsonOutput}
              className="w-full h-64 border border-input rounded-md bg-muted/50 overflow-auto"
              lineNumbers={true}
              aria-label="整形されたJSON出力結果"
            />
          ) : (
            <textarea
              id="json-output"
              ref={outputRef}
              value={jsonOutput}
              readOnly
              className="w-full h-64 p-3 border border-input rounded-md font-mono text-sm bg-muted/50"
              placeholder="整形されたJSONがここに表示されます..."
              aria-label="整形されたJSON出力結果"
            />
          )}
        </div>
      </div>

      {/* Error Display */}
      {!validationResult.isValid && validationResult.error && (
        <div id="json-error" className="mt-4 p-3 bg-destructive/10 border border-destructive/50 text-destructive rounded" role="alert">
          <strong>エラー:</strong> {validationResult.error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button 
          onClick={formatJSON} 
          disabled={!validationResult.isValid || !jsonInput.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
          aria-describedby="format-help"
          title="Ctrl+F"
        >
          整形
        </button>
        <button 
          onClick={minifyJSON}
          disabled={!validationResult.isValid || !jsonInput.trim()}
          className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-800 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
          title="Ctrl+M"
        >
          圧縮
        </button>
        <button 
          onClick={convertToJS}
          disabled={!validationResult.isValid || !jsonInput.trim()}
          className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded hover:bg-purple-700 dark:hover:bg-purple-800 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
          aria-label="JSONをJavaScriptオブジェクトに変換"
        >
          JavaScript変換
        </button>
        <button 
          onClick={escapeJSON}
          disabled={!jsonInput.trim()}
          className="px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded hover:bg-orange-700 dark:hover:bg-orange-800 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
          aria-label="JSON文字列をエスケープ"
        >
          エスケープ
        </button>
        <button 
          onClick={unescapeJSON}
          disabled={!jsonInput.trim()}
          className="px-4 py-2 bg-teal-600 dark:bg-teal-700 text-white rounded hover:bg-teal-700 dark:hover:bg-teal-800 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
          aria-label="エスケープされたJSON文字列を元に戻す"
        >
          アンエスケープ
        </button>
        <button 
          onClick={clearAll}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
          title="Ctrl+L"
          aria-label="入力と出力をすべてクリア"
        >
          すべてクリア
        </button>
      </div>
    </div>
  );
}