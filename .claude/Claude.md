# Quick Dev Tools - Claude Knowledge Base

## プロジェクト概要

Quick Dev Toolsは、エンジニアの開発作業を効率化するための便利なツール集を提供するWebアプリケーションです。様々なフォーマット変換、エンコード/デコード、生成ツールなどを1つのサイトで利用できます。

### 主要な特徴

- 完全無料で利用可能
- ブラウザ上で完結（サーバーへのデータ送信なし）
- レスポンシブデザイン対応
- 日本語・英語の多言語対応
- ダークモード対応
- アクセシビリティ対応

## 技術スタック

### コアフレームワーク

- **Next.js 15**: App Routerを使用したモダンなReactフレームワーク
- **React 19**: 最新版のReactライブラリ
- **TypeScript 5**: 型安全な開発環境

### UIライブラリ

- **Tailwind CSS 4**: ユーティリティファーストのCSSフレームワーク
- **shadcn/ui**: Radix UIベースの再利用可能なコンポーネント
- **Radix UI**: アクセシブルなUIプリミティブ
  - Navigation Menu
  - Dropdown Menu
  - Select
  - Tooltip
  - Tabs
  - Slider
  - など

### 国際化

- **next-intl**: Next.js向けの国際化ライブラリ
- 対応言語: 日本語(ja)、英語(en)
- メッセージファイル: `messages/ja.json`, `messages/en.json`

### その他のライブラリ

- **next-themes**: ダークモード対応
- **date-fns**: 日付操作
- **react-markdown**: Markdownレンダリング
- **react-syntax-highlighter**: シンタックスハイライト
- **qrcode**: QRコード生成

### 開発ツール

- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマッター
- **Jest**: テストフレームワーク
- **TypeScript**: 型チェック

## プロジェクト構造

```
quick-dev-tools/
├── .claude/              # Claude設定ファイル
├── messages/             # 国際化メッセージ
│   ├── en.json          # 英語メッセージ
│   └── ja.json          # 日本語メッセージ
├── public/              # 静的ファイル
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── [locale]/    # ロケール別ルーティング
│   │   ├── layout.tsx   # ルートレイアウト
│   │   ├── globals.css  # グローバルスタイル
│   │   └── ...
│   ├── components/      # 共通コンポーネント
│   │   ├── a11y/        # アクセシビリティコンポーネント
│   │   ├── ui/          # shadcn/ui コンポーネント
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── constants/       # 定数定義
│   │   └── tools.tsx    # ツール一覧定義
│   ├── features/        # 機能別モジュール
│   │   ├── home/        # ホームページ
│   │   ├── tools/       # 各種ツール
│   │   │   ├── format/           # フォーマッター
│   │   │   ├── timestamp/        # UNIX時間変換
│   │   │   ├── url-encoder/      # URLエンコーダー
│   │   │   ├── character-count/  # 文字数カウント
│   │   │   ├── uuid-generator/   # UUID生成
│   │   │   └── markdown-preview/ # Markdownプレビュー
│   │   ├── contact/     # お問い合わせ
│   │   ├── terms/       # 利用規約
│   │   └── privacy/     # プライバシーポリシー
│   ├── hooks/           # カスタムフック
│   ├── i18n/            # 国際化設定
│   ├── lib/             # ユーティリティ
│   │   ├── utils.ts     # 汎用ユーティリティ
│   │   ├── settings.ts  # 設定管理
│   │   └── worker-manager.ts
│   └── middleware.ts    # Next.js middleware（ロケール処理）
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.js
└── README.md
```

## 機能モジュール

### 実装済みツール

1. **なんでもフォーマッター** (`/tools/format`)
   - JSON、YAML、SQL、XMLなどのフォーマット整形
   - シンタックスハイライト表示
   - カテゴリ: format

2. **UNIX時間変換** (`/tools/timestamp`)
   - UNIX時間 ⇔ 日付時刻の相互変換
   - カテゴリ: converter

3. **URL Encoder/Decoder** (`/tools/url-encoder`)
   - URLエンコード/デコード機能
   - カテゴリ: encoder

4. **文字数カウント** (`/tools/character-count`)
   - 文字数、単語数、バイト数の詳細カウント
   - カテゴリ: utility

5. **UUID生成ツール** (`/tools/uuid-generator`)
   - UUID v1、v4、Nil UUIDの生成
   - カテゴリ: generator

6. **Markdownプレビュー** (`/tools/markdown-preview`)
   - リアルタイムプレビュー
   - GitHub Flavored Markdown対応
   - HTMLエクスポート機能
   - カテゴリ: format

### ツールカテゴリ

- **format**: フォーマッター
- **converter**: コンバーター
- **encoder**: エンコーダー
- **generator**: ジェネレーター
- **utility**: ユーティリティ

## 開発コマンド

```bash
# 開発サーバー起動（Turbopack使用）
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# リンター実行
npm run lint

# リンター自動修正
npm run lint:fix

# 型チェック
npm run type-check

# コードフォーマット
npm run format

# フォーマットチェック
npm run format:check

# コード品質チェック（型チェック + リント + フォーマット）
npm run quality

# テスト実行
npm test

# テスト監視モード
npm run test:watch

# テストカバレッジ
npm run test:coverage

# バンドルサイズ分析
npm run analyze
```

## アーキテクチャパターン

### Feature-Based構造

各機能は独立したモジュールとして`src/features/`配下に配置されています。

```
features/
└── {feature-name}/
    ├── components/    # 機能固有のコンポーネント
    ├── utils/         # 機能固有のユーティリティ
    ├── constants/     # 機能固有の定数
    └── hooks/         # 機能固有のカスタムフック
```

### ルーティング

- Next.js App Routerを使用
- ロケールベースのルーティング: `/[locale]/...`
- 動的ルーティングで多言語対応

### 状態管理

- 基本的にはReact Hooksベースのローカル状態管理
- 必要に応じてContext APIを使用
- サーバーコンポーネントとクライアントコンポーネントの適切な分離

### スタイリング

- Tailwind CSSのユーティリティクラス
- `cn()`ヘルパー関数でクラス名の結合（`lib/utils.ts`）
- CSS-in-JSは最小限（styled-jsx使用）

## コーディング規約

### TypeScript

- 厳格な型定義を使用
- `any`型の使用は避ける
- インターフェースと型エイリアスを適切に使い分ける

### コンポーネント

- 関数コンポーネントを使用
- Props型は明示的に定義
- 単一責任の原則に従う
- クライアントコンポーネントは`'use client'`ディレクティブを明示

### ネーミング規則

- コンポーネント: PascalCase（例: `ToolCard.tsx`）
- ファイル: kebab-case（例: `character-count/`）
- 関数・変数: camelCase
- 定数: UPPER_SNAKE_CASE
- 型・インターフェース: PascalCase

### インポート順序

1. React関連
2. サードパーティライブラリ
3. 内部モジュール（絶対パス）
4. 相対パス
5. 型インポート
6. スタイル

### 国際化

- すべてのユーザー向けテキストは`messages/`の翻訳ファイルに定義
- `useTranslations`フックを使用して翻訳を取得
- 翻訳キーは階層的に管理（例: `tools.format.title`）

## アクセシビリティ

- セマンティックHTMLの使用
- ARIA属性の適切な使用
- キーボードナビゲーション対応
- スクリーンリーダー対応
- フォーカス管理（FocusTrap コンポーネント）
- スキップリンク（SkipLink コンポーネント）

## パフォーマンス最適化

- サーバーコンポーネントの活用
- 動的インポートによるコード分割
- 画像最適化（Next.js Image コンポーネント）
- バンドルサイズ分析（webpack-bundle-analyzer）

## テスト

- Jestを使用したユニットテスト
- コンポーネントテストの推奨
- テストカバレッジの維持

## 新しいツールの追加方法

1. **機能ディレクトリの作成**
   ```bash
   mkdir -p src/features/tools/{tool-name}/components
   mkdir -p src/features/tools/{tool-name}/utils
   ```

2. **ツール定義の追加**
   - `src/constants/tools.tsx`にツール情報を追加
   - アイコン、タイトル、説明、カテゴリを定義

3. **翻訳の追加**
   - `messages/ja.json`と`messages/en.json`に翻訳を追加

4. **ページの作成**
   - `src/app/[locale]/tools/{tool-name}/page.tsx`を作成

5. **コンポーネントの実装**
   - `src/features/tools/{tool-name}/components/`に必要なコンポーネントを作成

6. **ユーティリティの実装**
   - `src/features/tools/{tool-name}/utils/`にロジックを実装

## よくある作業

### 翻訳の更新

1. `messages/ja.json`を編集
2. 対応する`messages/en.json`も編集
3. コンポーネントで`useTranslations`を使用

### 新しいUIコンポーネントの追加

shadcn/uiからコンポーネントを追加する場合:
```bash
npx shadcn@latest add {component-name}
```

### 環境変数

現在、環境変数は使用していません。必要な場合は`.env.local`を作成してください。

## デプロイ

- Vercelへのデプロイを推奨
- Next.js 15のApp Router完全対応
- 自動的にサーバーレス関数として展開

## ブランチ戦略

- **main**: 本番環境
- **claude/***: Claude AIによる開発ブランチ
- 各機能開発は個別のブランチで実施

## コミット規約

- プレフィックスを使用: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- 簡潔で分かりやすいメッセージ

## 注意事項

- ユーザーデータはすべてクライアントサイドで処理
- サーバーにデータを送信しない
- プライバシーとセキュリティを最優先
- パフォーマンスを常に意識
- アクセシビリティを損なわない

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [next-intl](https://next-intl-docs.vercel.app/)
