'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { parseMarkdown, generateMarkdownToc, countMarkdownStats, exportMarkdownAs, MarkdownPreviewOptions, DEFAULT_MARKDOWN_OPTIONS } from '../utils/markdown';
import { Eye, Code2, Download, Copy, FileText, BarChart3, List } from 'lucide-react';

export default function MarkdownPreview() {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<MarkdownPreviewOptions>(DEFAULT_MARKDOWN_OPTIONS);
  const [activeTab, setActiveTab] = useState('editor');
  const [toc, setToc] = useState<Array<{ level: number; title: string; id: string }>>([]);
  const [stats, setStats] = useState({ words: 0, characters: 0, lines: 0, headers: 0 });

  useEffect(() => {
    if (input.trim()) {
      const tocData = generateMarkdownToc(input);
      setToc(tocData);
      
      const statsData = countMarkdownStats(input);
      setStats(statsData);
    } else {
      setToc([]);
      setStats({ words: 0, characters: 0, lines: 0, headers: 0 });
    }
  }, [input]);

  const handleCopy = async (content: string, type: string) => {
    await navigator.clipboard.writeText(content);
  };

  const handleDownload = (format: 'html' | 'txt' | 'md') => {
    if (!input.trim()) return;

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'html':
        content = exportMarkdownAs(input, 'html');
        filename = 'document.html';
        mimeType = 'text/html';
        break;
      case 'txt':
        content = exportMarkdownAs(input, 'txt');
        filename = 'document.txt';
        mimeType = 'text/plain';
        break;
      case 'md':
        content = input;
        filename = 'document.md';
        mimeType = 'text/markdown';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sampleMarkdown = `# Markdown プレビューサンプル

## 基本的な書式

**太字**と*斜体*、\`コード\`の例です。

### リスト

- 項目1
- 項目2
- 項目3

### 番号付きリスト

1. 最初の項目
2. 二番目の項目
3. 三番目の項目

### タスクリスト

- [x] 完了したタスク
- [ ] 未完了のタスク
- [ ] もうひとつのタスク

## コードブロック

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## 引用

> これは引用文です。
> 複数行にわたって記述できます。

## テーブル

| 名前 | 年齢 | 職業 |
|------|------|------|
| 田中 | 30 | エンジニア |
| 佐藤 | 25 | デザイナー |
| 鈴木 | 35 | マネージャー |

## リンクと画像

[リンクの例](https://example.com)

---

## 絵文字 :smile:

:heart: :thumbsup: :fire: :star: :rocket:
`;

  const renderPreview = () => {
    const html = parseMarkdown(input || sampleMarkdown, options);
    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Options Panel */}
      <Card>
        <CardHeader>
          <CardTitle>プレビューオプション</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="tables"
                checked={options.enableTables}
                onCheckedChange={(checked) => setOptions({...options, enableTables: checked})}
              />
              <Label htmlFor="tables">テーブル</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="emoji"
                checked={options.enableEmoji}
                onCheckedChange={(checked) => setOptions({...options, enableEmoji: checked})}
              />
              <Label htmlFor="emoji">絵文字</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="tasklists"
                checked={options.enableTaskLists}
                onCheckedChange={(checked) => setOptions({...options, enableTaskLists: checked})}
              />
              <Label htmlFor="tasklists">タスクリスト</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="code"
                checked={options.enableCodeHighlight}
                onCheckedChange={(checked) => setOptions({...options, enableCodeHighlight: checked})}
              />
              <Label htmlFor="code">コードハイライト</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput(sampleMarkdown)}
            >
              <FileText className="h-4 w-4 mr-2" />
              サンプルを読み込み
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('')}
            >
              クリア
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            エディター
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            プレビュー
          </TabsTrigger>
          <TabsTrigger value="toc" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            目次
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            統計
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Markdown エディター
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(input, 'markdown')}
                    disabled={!input.trim()}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Markdownを入力してください..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="font-mono text-sm h-96 resize-none"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                プレビュー
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload('html')}
                    disabled={!input.trim()}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    HTML
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload('md')}
                    disabled={!input.trim()}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    MD
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg p-6 min-h-96">
                {renderPreview()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="toc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>目次</CardTitle>
            </CardHeader>
            <CardContent>
              {toc.length > 0 ? (
                <div className="space-y-2">
                  {toc.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 ${
                        item.level === 1 ? 'font-bold' : 
                        item.level === 2 ? 'font-semibold ml-4' : 
                        'ml-8 text-gray-600'
                      }`}
                    >
                      <Badge variant="outline" className="text-xs">
                        H{item.level}
                      </Badge>
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  見出しが見つかりません
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>文書統計</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}