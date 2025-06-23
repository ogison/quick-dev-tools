'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { computeDiff, computeDiffStats, generateUnifiedDiff, highlightInlineDiff, DiffResult } from '../utils/diff';
import { Copy, Download, RotateCcw, ArrowUpDown, Plus, Minus, FileText } from 'lucide-react';

export default function DiffChecker() {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [diffResult, setDiffResult] = useState<DiffResult[]>([]);
  const [stats, setStats] = useState({ additions: 0, deletions: 0, modifications: 0, totalLines: 0 });
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified' | 'inline'>('side-by-side');
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  useEffect(() => {
    if (oldText || newText) {
      const result = computeDiff(oldText, newText);
      setDiffResult(result);
      setStats(computeDiffStats(result));
    } else {
      setDiffResult([]);
      setStats({ additions: 0, deletions: 0, modifications: 0, totalLines: 0 });
    }
  }, [oldText, newText]);

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSwap = () => {
    const temp = oldText;
    setOldText(newText);
    setNewText(temp);
  };

  const handleReset = () => {
    setOldText('');
    setNewText('');
  };

  const loadSample = () => {
    setOldText(`function hello() {
  console.log("Hello World");
  var x = 10;
  return x;
}`);
    setNewText(`function hello() {
  console.log("Hello, World!");
  const x = 20;
  const y = 30;
  return x + y;
}`);
  };

  const renderSideBySide = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-medium mb-2 text-red-700">元のテキスト</h4>
        <div className="border rounded p-4 bg-red-50 font-mono text-sm max-h-96 overflow-auto">
          {diffResult.map((diff, index) => (
            <div key={index} className={`flex ${diff.type === 'insert' ? 'hidden' : ''}`}>
              {showLineNumbers && (
                <span className="text-gray-400 mr-4 w-8 text-right">
                  {diff.oldLineNumber || ''}
                </span>
              )}
              <span className={`flex-1 ${
                diff.type === 'delete' ? 'bg-red-200' : 
                diff.type === 'modify' ? 'bg-yellow-200' : ''
              }`}>
                {diff.oldText || '\u00A0'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2 text-green-700">新しいテキスト</h4>
        <div className="border rounded p-4 bg-green-50 font-mono text-sm max-h-96 overflow-auto">
          {diffResult.map((diff, index) => (
            <div key={index} className={`flex ${diff.type === 'delete' ? 'hidden' : ''}`}>
              {showLineNumbers && (
                <span className="text-gray-400 mr-4 w-8 text-right">
                  {diff.newLineNumber || ''}
                </span>
              )}
              <span className={`flex-1 ${
                diff.type === 'insert' ? 'bg-green-200' : 
                diff.type === 'modify' ? 'bg-yellow-200' : ''
              }`}>
                {diff.newText || '\u00A0'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUnified = () => {
    const unifiedDiff = generateUnifiedDiff(oldText, newText, 'original.txt', 'modified.txt');
    
    return (
      <div>
        <h4 className="font-medium mb-2">統合差分表示</h4>
        <div className="border rounded p-4 bg-gray-50 font-mono text-sm max-h-96 overflow-auto">
          {unifiedDiff.split('\n').map((line, index) => {
            let bgColor = '';
            let icon = null;
            
            if (line.startsWith('+')) {
              bgColor = 'bg-green-100';
              icon = <Plus className="h-3 w-3 text-green-600 inline mr-2" />;
            } else if (line.startsWith('-')) {
              bgColor = 'bg-red-100';
              icon = <Minus className="h-3 w-3 text-red-600 inline mr-2" />;
            } else if (line.startsWith('@@')) {
              bgColor = 'bg-blue-100';
            }
            
            return (
              <div key={index} className={`${bgColor} px-2 py-1`}>
                {icon}
                {line}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderInline = () => (
    <div>
      <h4 className="font-medium mb-2">インライン差分表示</h4>
      <div className="border rounded p-4 bg-gray-50 font-mono text-sm max-h-96 overflow-auto">
        {diffResult.map((diff, index) => {
          if (diff.type === 'equal') {
            return (
              <div key={index} className="py-1">
                {showLineNumbers && (
                  <span className="text-gray-400 mr-4">
                    {diff.oldLineNumber}-{diff.newLineNumber}
                  </span>
                )}
                {diff.oldText}
              </div>
            );
          } else if (diff.type === 'modify') {
            const highlighted = highlightInlineDiff(diff.oldText, diff.newText);
            return (
              <div key={index} className="py-1">
                {showLineNumbers && (
                  <span className="text-gray-400 mr-4">
                    {diff.oldLineNumber}-{diff.newLineNumber}
                  </span>
                )}
                <div className="bg-red-100 mb-1" dangerouslySetInnerHTML={{ __html: '- ' + highlighted.old }} />
                <div className="bg-green-100" dangerouslySetInnerHTML={{ __html: '+ ' + highlighted.new }} />
              </div>
            );
          } else {
            return (
              <div key={index} className={`py-1 ${
                diff.type === 'insert' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {showLineNumbers && (
                  <span className="text-gray-400 mr-4">
                    {diff.type === 'insert' ? diff.newLineNumber : diff.oldLineNumber}
                  </span>
                )}
                {diff.type === 'insert' ? '+ ' : '- '}
                {diff.type === 'insert' ? diff.newText : diff.oldText}
              </div>
            );
          }
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>差分チェッカー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={loadSample}>
              <FileText className="h-4 w-4 mr-2" />
              サンプル
            </Button>
            <Button variant="outline" size="sm" onClick={handleSwap}>
              <ArrowUpDown className="h-4 w-4 mr-2" />
              入れ替え
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              リセット
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Input Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>元のテキスト</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="比較元のテキストを入力してください..."
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              className="font-mono text-sm h-64 resize-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>新しいテキスト</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="比較先のテキストを入力してください..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="font-mono text-sm h-64 resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      {diffResult.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>差分統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-green-600" />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  追加: {stats.additions}行
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4 text-red-600" />
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  削除: {stats.deletions}行
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  変更: {stats.modifications}行
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  総行数: {stats.totalLines}行
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Mode Selector */}
      {diffResult.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              差分表示
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'side-by-side' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('side-by-side')}
                >
                  並列表示
                </Button>
                <Button
                  variant={viewMode === 'unified' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('unified')}
                >
                  統合表示
                </Button>
                <Button
                  variant={viewMode === 'inline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('inline')}
                >
                  インライン
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                />
                行番号を表示
              </label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(viewMode === 'unified' ? generateUnifiedDiff(oldText, newText) : `${oldText}\n---\n${newText}`)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  コピー
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(
                    viewMode === 'unified' ? generateUnifiedDiff(oldText, newText) : `${oldText}\n---\n${newText}`,
                    'diff-result.txt'
                  )}
                >
                  <Download className="h-4 w-4 mr-2" />
                  ダウンロード
                </Button>
              </div>
            </div>

            {viewMode === 'side-by-side' && renderSideBySide()}
            {viewMode === 'unified' && renderUnified()}
            {viewMode === 'inline' && renderInline()}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {diffResult.length === 0 && (oldText || newText) && (
        <Alert>
          <AlertDescription>
            両方のテキストエリアに内容を入力すると、差分が表示されます。
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}