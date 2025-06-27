'use client';

import {
  Copy,
  Download,
  Upload,
  Save,
  Eye,
  Edit3,
  Bold,
  Italic,
  Link,
  Code,
  Image,
  List,
  Hash,
  Table,
  BarChart3,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import {
  parseMarkdown,
  countMarkdownStats,
  exportMarkdownAs,
  insertMarkdownSyntax,
  handleKeyboardShortcut,
  getMarkdownShortcuts,
} from '../utils/markdown-editor';

export default function MarkdownEditor() {
  const [content, setContent] = useState(`# Markdown Editor

## 機能紹介

この**Markdown Editor**では以下の機能が利用できます：

### 基本的な書式
- **太字** と *斜体*
- \`インラインコード\`
- [リンク](https://example.com)

### リスト
1. 番号付きリスト
2. 二番目の項目
3. 三番目の項目

- 箇条書きリスト
- もうひとつの項目

### コードブロック

\`\`\`javascript
function hello() {
  console.log("Hello, Markdown!");
}
\`\`\`

### 引用

> これは引用文です。
> 複数行にわたって記述できます。

### テーブル

| 項目 | 説明 | 状態 |
|------|------|------|
| 基本機能 | 完了 | ✅ |
| 拡張機能 | 開発中 | 🚧 |

---

**使い方：** 左側で編集、右側でプレビューが確認できます。
`);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [fileName, setFileName] = useState('document.md');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = countMarkdownStats(content);
  const previewHtml = parseMarkdown(content);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!textareaRef.current) {return;}

      const textarea = textareaRef.current;
      const result = handleKeyboardShortcut(
        e,
        content,
        textarea.selectionStart,
        textarea.selectionEnd
      );

      if (result) {
        e.preventDefault();
        setContent(result.newContent);

        // Set cursor position after update
        setTimeout(() => {
          textarea.selectionStart = result.newStart;
          textarea.selectionEnd = result.newEnd;
          textarea.focus();
        }, 0);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [content]);

  const insertSyntax = (type: string) => {
    if (!textareaRef.current) {return;}

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    let result: { newContent: string; newStart: number; newEnd: number } | null = null;

    switch (type) {
      case 'bold':
        result = insertMarkdownSyntax.bold(content, start, end);
        break;
      case 'italic':
        result = insertMarkdownSyntax.italic(content, start, end);
        break;
      case 'code':
        result = insertMarkdownSyntax.code(content, start, end);
        break;
      case 'link':
        result = insertMarkdownSyntax.link(content, start, end);
        break;
      case 'image':
        result = insertMarkdownSyntax.image(content, start, end);
        break;
      case 'h1':
        result = insertMarkdownSyntax.header(content, start, end, 1);
        break;
      case 'h2':
        result = insertMarkdownSyntax.header(content, start, end, 2);
        break;
      case 'h3':
        result = insertMarkdownSyntax.header(content, start, end, 3);
        break;
      case 'ul':
        result = insertMarkdownSyntax.list(content, start, end, false);
        break;
      case 'ol':
        result = insertMarkdownSyntax.list(content, start, end, true);
        break;
      case 'table':
        result = insertMarkdownSyntax.table(content, start);
        break;
      case 'codeblock':
        result = insertMarkdownSyntax.codeBlock(content, start, end);
        break;
    }

    if (result) {
      setContent(result.newContent);

      setTimeout(() => {
        textarea.selectionStart = result!.newStart;
        textarea.selectionEnd = result!.newEnd;
        textarea.focus();
      }, 0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {return;}

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setContent(content);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleDownload = (format: 'md' | 'html' | 'txt') => {
    let downloadContent = '';
    let mimeType = '';
    let extension = '';

    switch (format) {
      case 'md':
        downloadContent = content;
        mimeType = 'text/markdown';
        extension = 'md';
        break;
      case 'html':
        downloadContent = exportMarkdownAs(content, 'html');
        mimeType = 'text/html';
        extension = 'html';
        break;
      case 'txt':
        downloadContent = content;
        mimeType = 'text/plain';
        extension = 'txt';
        break;
    }

    const blob = new Blob([downloadContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.[^/.]+$/, '')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
  };

  const toolbarButtons = [
    { icon: Bold, action: 'bold', tooltip: '太字 (Ctrl+B)' },
    { icon: Italic, action: 'italic', tooltip: '斜体 (Ctrl+I)' },
    { icon: Code, action: 'code', tooltip: 'インラインコード' },
    { icon: Link, action: 'link', tooltip: 'リンク (Ctrl+K)' },
    { icon: Image, action: 'image', tooltip: '画像' },
    { icon: Hash, action: 'h1', tooltip: '見出し1' },
    { icon: List, action: 'ul', tooltip: '箇条書き' },
    { icon: Table, action: 'table', tooltip: 'テーブル' },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4">
      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* View Mode */}
              <div className="flex rounded-lg bg-gray-100 p-1">
                <Button
                  variant={viewMode === 'edit' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('edit')}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('split')}
                >
                  編集/プレビュー
                </Button>
                <Button
                  variant={viewMode === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('preview')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Format Buttons */}
              {toolbarButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => insertSyntax(button.action)}
                  title={button.tooltip}
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                開く
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />

              <Button variant="outline" size="sm" onClick={() => handleDownload('md')}>
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>

              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                コピー
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor/Preview */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {(viewMode === 'edit' || viewMode === 'split') && (
          <Card>
            <CardHeader>
              <CardTitle>Markdown Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-96 resize-none font-mono text-sm"
                placeholder="Markdownを入力してください..."
              />
            </CardContent>
          </Card>
        )}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                プレビュー
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownload('html')}>
                    <Download className="mr-2 h-4 w-4" />
                    HTML
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose min-h-96 max-w-none rounded border bg-white p-4"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            文書統計
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.words}</div>
              <div className="text-sm text-gray-600">単語数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.characters}</div>
              <div className="text-sm text-gray-600">文字数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.lines}</div>
              <div className="text-sm text-gray-600">行数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.headers}</div>
              <div className="text-sm text-gray-600">見出し数</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts Help */}
      <Card>
        <CardHeader>
          <CardTitle>キーボードショートカット</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getMarkdownShortcuts().map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between rounded bg-gray-50 p-2">
                <span className="text-sm">{shortcut.description}</span>
                <kbd className="rounded bg-gray-200 px-2 py-1 font-mono text-xs">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
