/**
 * Markdown プレビュー関連のユーティリティ関数
 */

/**
 * MarkdownをHTMLに変換してダウンロード
 */
export const exportToHtml = (markdown: string, filename: string = 'document.html'): void => {
  // HTML テンプレート
  const htmlTemplate = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Export</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }
    h1 { font-size: 2.25em; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
    h2 { font-size: 1.75em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h3 { font-size: 1.5em; }
    h4 { font-size: 1.25em; }
    h5 { font-size: 1em; }
    h6 { font-size: 0.875em; color: #666; }
    code {
      background-color: #f6f8fa;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.9em;
    }
    pre {
      background-color: #f6f8fa;
      padding: 1em;
      border-radius: 6px;
      overflow-x: auto;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 1em;
      color: #666;
      margin: 1em 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    table th,
    table td {
      border: 1px solid #ddd;
      padding: 0.5em 1em;
      text-align: left;
    }
    table th {
      background-color: #f6f8fa;
      font-weight: 600;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    ul, ol {
      padding-left: 2em;
    }
    li {
      margin: 0.25em 0;
    }
    hr {
      border: none;
      border-top: 2px solid #eee;
      margin: 2em 0;
    }
    input[type="checkbox"] {
      margin-right: 0.5em;
    }
  </style>
</head>
<body>
  <div id="content">
    ${markdown}
  </div>
</body>
</html>`;

  // Blobを作成してダウンロード
  const blob = new Blob([htmlTemplate], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Markdownテキストをクリップボードにコピー
 */
export const copyMarkdown = async (markdown: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(markdown);
    return true;
  } catch (error) {
    console.error('Failed to copy markdown:', error);
    return false;
  }
};

/**
 * HTMLをクリップボードにコピー
 */
export const copyHtml = async (html: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(html);
    return true;
  } catch (error) {
    console.error('Failed to copy HTML:', error);
    return false;
  }
};

/**
 * サンプルMarkdownテキストを生成
 */
export const getSampleMarkdown = (): string => {
  return `# Markdownプレビューへようこそ

このツールでは、**Markdownをリアルタイムでプレビュー**できます。

## 機能

- GitHub Flavored Markdown対応
- リアルタイムプレビュー
- HTMLエクスポート
- シンタックスハイライト

## 使い方

### 基本的なフォーマット

**太字**、*イタリック*、~~取り消し線~~が使えます。

### リスト

- 箇条書きリスト
- もう一つの項目
  - ネストされた項目

1. 番号付きリスト
2. 二番目の項目
3. 三番目の項目

### コード

インラインコード: \`const hello = "world";\`

コードブロック:
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("World");
\`\`\`

### テーブル

| ヘッダー1 | ヘッダー2 | ヘッダー3 |
|----------|----------|----------|
| セル1    | セル2    | セル3    |
| セル4    | セル5    | セル6    |

### 引用

> これは引用ブロックです。
> 複数行にわたって書くこともできます。

### リンク

[Googleへのリンク](https://www.google.com)

### タスクリスト

- [x] 完了したタスク
- [ ] 未完了のタスク
- [ ] もう一つのタスク

---

それでは、Markdownを楽しんでください！
`;
};
