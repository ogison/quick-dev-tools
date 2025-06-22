'use client';

import { useJsonFormatter } from '../hooks/useJsonFormatter';
import type { IndentType } from '../types';

import { SyntaxHighlightedJSON } from './SyntaxHighlightedJSON';
import { VirtualizedTextArea } from './VirtualizedTextArea';

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
      <h2 className="mb-2 text-2xl font-semibold">JSON整形・検証</h2>
      <p className="text-muted-foreground mb-6">JSONデータの整形、検証、変換を行うツールです</p>

      {/* Keyboard shortcuts help */}
      <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>キーボードショートカット:</strong>
          <span className="ml-2">Ctrl+F (整形) • Ctrl+M (圧縮) • Ctrl+L (クリア)</span>
        </p>
        {enableVirtualization && (
          <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
            <strong>仮想スクロール有効:</strong> 大容量JSONのため高速表示モードが有効になっています
          </p>
        )}
      </div>

      {/* Options Toolbar */}
      <div className="mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">インデント:</label>
            <select
              value={options.indentType}
              onChange={(e) => handleIndentTypeChange(e.target.value as IndentType)}
              className="border-input bg-background focus:ring-ring rounded-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2"
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
              className="focus:ring-ring rounded focus:ring-2"
              aria-label="シンタックスハイライトを有効化"
            />
          </div>
          <button
            onClick={loadSample}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded px-4 py-2"
            aria-label="サンプルJSONを読み込み"
          >
            サンプル読み込み
          </button>
        </div>
      </div>

      {/* Input/Output Areas */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium" htmlFor="json-input">
              入力JSON
              <span className="text-muted-foreground ml-2 text-xs">
                （ファイルをドラッグ&ドロップも可能）
              </span>
            </label>
            {!validationResult.isValid && validationResult.line && (
              <span className="text-destructive text-xs" role="alert">
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
              className={`bg-background focus:ring-ring h-64 w-full rounded-md border p-3 font-mono text-sm transition-colors focus:border-transparent focus:ring-2 ${
                !validationResult.isValid ? 'border-destructive bg-destructive/10' : 'border-input'
              } ${isDragging ? 'border-primary bg-primary/10' : ''}`}
              aria-invalid={!validationResult.isValid}
              aria-describedby={!validationResult.isValid ? 'json-error' : undefined}
            />
            {isDragging && (
              <div className="bg-primary/20 border-primary absolute inset-0 flex items-center justify-center rounded-md border-2 border-dashed backdrop-blur-sm">
                <div className="text-primary font-medium">
                  JSONファイルをここにドロップしてください
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium" htmlFor="json-output">
              出力結果
            </label>
            {jsonOutput && (
              <button
                onClick={handleCopy}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded px-3 py-1 text-sm transition-colors"
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
              className="border-input bg-muted/50 h-64 w-full rounded-md border"
              placeholder="整形されたJSONがここに表示されます..."
              aria-label="整形されたJSON出力結果"
              lineNumbers={true}
              syntaxHighlight={enableSyntaxHighlight}
            />
          ) : enableSyntaxHighlight && jsonOutput && validationResult.isValid ? (
            <SyntaxHighlightedJSON
              json={jsonOutput}
              className="border-input bg-muted/50 h-64 w-full overflow-auto rounded-md border"
              lineNumbers={true}
              aria-label="整形されたJSON出力結果"
            />
          ) : (
            <textarea
              id="json-output"
              ref={outputRef}
              value={jsonOutput}
              readOnly
              className="border-input bg-muted/50 h-64 w-full rounded-md border p-3 font-mono text-sm"
              placeholder="整形されたJSONがここに表示されます..."
              aria-label="整形されたJSON出力結果"
            />
          )}
        </div>
      </div>

      {/* Error Display */}
      {!validationResult.isValid && validationResult.error && (
        <div
          id="json-error"
          className="bg-destructive/10 border-destructive/50 text-destructive mt-4 rounded border p-3"
          role="alert"
        >
          <strong>エラー:</strong> {validationResult.error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={formatJSON}
          disabled={!validationResult.isValid || !jsonInput.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground rounded px-4 py-2 transition-colors disabled:cursor-not-allowed"
          aria-describedby="format-help"
          title="Ctrl+F"
        >
          整形
        </button>
        <button
          onClick={minifyJSON}
          disabled={!validationResult.isValid || !jsonInput.trim()}
          className="disabled:bg-muted disabled:text-muted-foreground rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed dark:bg-green-700 dark:hover:bg-green-800"
          title="Ctrl+M"
        >
          圧縮
        </button>
        <button
          onClick={convertToJS}
          disabled={!validationResult.isValid || !jsonInput.trim()}
          className="disabled:bg-muted disabled:text-muted-foreground rounded bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed dark:bg-purple-700 dark:hover:bg-purple-800"
          aria-label="JSONをJavaScriptオブジェクトに変換"
        >
          JavaScript変換
        </button>
        <button
          onClick={escapeJSON}
          disabled={!jsonInput.trim()}
          className="disabled:bg-muted disabled:text-muted-foreground rounded bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed dark:bg-orange-700 dark:hover:bg-orange-800"
          aria-label="JSON文字列をエスケープ"
        >
          エスケープ
        </button>
        <button
          onClick={unescapeJSON}
          disabled={!jsonInput.trim()}
          className="disabled:bg-muted disabled:text-muted-foreground rounded bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed dark:bg-teal-700 dark:hover:bg-teal-800"
          aria-label="エスケープされたJSON文字列を元に戻す"
        >
          アンエスケープ
        </button>
        <button
          onClick={clearAll}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded px-4 py-2 transition-colors"
          title="Ctrl+L"
          aria-label="入力と出力をすべてクリア"
        >
          すべてクリア
        </button>
      </div>
    </div>
  );
}
