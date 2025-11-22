'use client';

import { Download, Copy, Eye, Code, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

import CopyButton from '@/components/shared/CopyButton';
import ToolContainer from '@/components/shared/ToolContainer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { exportToHtml, getSampleMarkdown } from '../utils/markdown-utils';

export default function MarkdownPreviewTool() {
  const [markdown, setMarkdown] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('edit');

  useEffect(() => {
    // 初回ロード時にサンプルMarkdownを設定
    setMarkdown(getSampleMarkdown());
  }, []);

  const handleExportHtml = () => {
    if (!markdown.trim()) {
      toast.error('エクスポートするMarkdownテキストがありません');
      return;
    }

    try {
      // Markdownを含むHTMLとしてエクスポート
      const htmlContent = convertMarkdownToHtml(markdown);
      exportToHtml(htmlContent);
      toast.success('HTMLファイルをエクスポートしました');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('HTMLのエクスポートに失敗しました');
    }
  };

  const convertMarkdownToHtml = (md: string): string => {
    // この関数は簡易的なものです。実際のHTML変換はサーバーサイドで行うのが理想的です
    // ここでは基本的な変換のみを行います
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br/>');
  };

  const handleCopyHtml = async () => {
    if (!markdown.trim()) {
      toast.error('コピーするMarkdownテキストがありません');
      return;
    }

    try {
      const htmlContent = convertMarkdownToHtml(markdown);
      await navigator.clipboard.writeText(htmlContent);
      toast.success('HTMLをコピーしました');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('HTMLのコピーに失敗しました');
    }
  };

  const handleLoadSample = () => {
    setMarkdown(getSampleMarkdown());
    toast.success('サンプルMarkdownを読み込みました');
  };

  const handleClear = () => {
    setMarkdown('');
    toast.success('テキストをクリアしました');
  };

  return (
    <ToolContainer
      title="Markdownプレビュー"
      description="Markdownをリアルタイムでプレビュー。GitHub Flavored Markdown対応、HTMLエクスポート可能。"
    >
      <div className="space-y-4">
        {/* ツールバー */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleLoadSample} variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            サンプルを読み込む
          </Button>
          <Button onClick={handleClear} variant="outline" size="sm">
            クリア
          </Button>
          <div className="ml-auto flex gap-2">
            <Button onClick={handleExportHtml} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              HTMLエクスポート
            </Button>
            <Button onClick={handleCopyHtml} variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              HTMLをコピー
            </Button>
          </div>
        </div>

        {/* エディタとプレビュー */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="edit">
              <Code className="mr-2 h-4 w-4" />
              編集
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="mr-2 h-4 w-4" />
              プレビュー
            </TabsTrigger>
            <TabsTrigger value="split">
              <FileText className="mr-2 h-4 w-4" />
              分割表示
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <div className="relative">
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="ここにMarkdownを入力してください..."
                className="min-h-[500px] font-mono text-sm"
              />
              <div className="absolute right-2 top-2">
                <CopyButton text={markdown}>Markdownをコピー</CopyButton>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="min-h-[500px] rounded-lg border bg-white p-6 dark:bg-gray-900">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    code({ inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="split" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* エディタ */}
              <div className="relative">
                <div className="mb-2 text-sm font-medium">編集</div>
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="ここにMarkdownを入力してください..."
                  className="min-h-[500px] font-mono text-sm"
                />
                <div className="absolute right-2 top-8">
                  <CopyButton text={markdown}>Markdownをコピー</CopyButton>
                </div>
              </div>

              {/* プレビュー */}
              <div>
                <div className="mb-2 text-sm font-medium">プレビュー</div>
                <div className="min-h-[500px] rounded-lg border bg-white p-6 dark:bg-gray-900">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      components={{
                        code({ inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {markdown}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* 統計情報 */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <div className="font-medium text-muted-foreground">文字数</div>
              <div className="text-2xl font-bold">{markdown.length.toLocaleString()}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">行数</div>
              <div className="text-2xl font-bold">
                {markdown.split('\n').length.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">単語数</div>
              <div className="text-2xl font-bold">
                {markdown.split(/\s+/).filter(Boolean).length.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">段落数</div>
              <div className="text-2xl font-bold">
                {markdown.split(/\n\n+/).filter(Boolean).length.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* ヘルプテキスト */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
          <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
            Markdown記法のヒント
          </h3>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>
              <code className="rounded bg-blue-100 px-1 dark:bg-blue-900"># 見出し1</code> -{' '}
              見出しを作成
            </li>
            <li>
              <code className="rounded bg-blue-100 px-1 dark:bg-blue-900">**太字**</code> - 太字
            </li>
            <li>
              <code className="rounded bg-blue-100 px-1 dark:bg-blue-900">*イタリック*</code> -
              イタリック
            </li>
            <li>
              <code className="rounded bg-blue-100 px-1 dark:bg-blue-900">`コード`</code> -
              インラインコード
            </li>
            <li>
              <code className="rounded bg-blue-100 px-1 dark:bg-blue-900">
                ```言語名 コードブロック ```
              </code>{' '}
              - コードブロック
            </li>
            <li>
              <code className="rounded bg-blue-100 px-1 dark:bg-blue-900">- リスト項目</code> -
              箇条書き
            </li>
            <li>
              <code className="rounded bg-blue-100 px-1 dark:bg-blue-900">
                [リンクテキスト](URL)
              </code>{' '}
              - リンク
            </li>
          </ul>
        </div>
      </div>
    </ToolContainer>
  );
}
