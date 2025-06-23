import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function HowToUsePage() {
  const tools = [
    {
      name: 'JSON Formatter',
      path: '/tools/json',
      description: 'JSONデータの整形・圧縮・検証',
      usage: [
        'テキストエリアにJSONデータを貼り付けます',
        '「整形」ボタンをクリックして読みやすい形式に変換',
        '「圧縮」ボタンで最小化、「検証」で構文チェック',
        'コピーボタンで結果をクリップボードにコピー'
      ]
    },
    {
      name: 'Base64 Encoder/Decoder',
      path: '/tools/base64',
      description: 'テキストやファイルのBase64変換',
      usage: [
        'エンコード：テキストを入力して「エンコード」をクリック',
        'デコード：Base64文字列を入力して「デコード」をクリック',
        'ファイル対応：ファイルを選択して自動エンコード',
        'クリアボタンで入力内容をリセット'
      ]
    },
    {
      name: 'URL Encoder/Decoder',
      path: '/tools/url-encoder',
      description: 'URLの特殊文字をエンコード・デコード',
      usage: [
        'エンコードしたいURLまたはテキストを入力',
        'リアルタイムで変換結果が表示されます',
        'エンコード/デコードを切り替えて使用',
        'コピーボタンで結果を取得'
      ]
    },
    {
      name: 'Hash Generator',
      path: '/tools/hash-generator',
      description: '各種ハッシュ値の生成',
      usage: [
        'テキストまたはファイルを入力',
        '生成したいハッシュアルゴリズムを選択',
        'MD5、SHA-1、SHA-256、SHA-512に対応',
        '生成されたハッシュ値をコピー'
      ]
    },
    {
      name: 'Regex Tester',
      path: '/tools/regex',
      description: '正規表現のテストとマッチング',
      usage: [
        '正規表現パターンを入力',
        'テスト対象のテキストを入力',
        'リアルタイムでマッチ結果を確認',
        'フラグ（g, i, m等）を設定可能'
      ]
    },
    {
      name: 'Color Palette Generator',
      path: '/tools/color',
      description: 'カラーパレットの生成と管理',
      usage: [
        'ベースカラーを選択またはHEX値を入力',
        'パレットタイプを選択（類似色、補色等）',
        '生成されたパレットから色を選択',
        '各種フォーマット（HEX、RGB、HSL）でコピー'
      ]
    },
    {
      name: 'QR Code Generator',
      path: '/tools/qr',
      description: 'QRコードの生成',
      usage: [
        'テキストまたはURLを入力',
        'QRコードが自動生成されます',
        'サイズを調整可能',
        '画像としてダウンロード'
      ]
    },
    {
      name: 'Password Generator',
      path: '/tools/password',
      description: 'セキュアなパスワード生成',
      usage: [
        'パスワードの長さを設定（8〜128文字）',
        '含める文字種を選択（大文字、小文字、数字、記号）',
        '「生成」ボタンをクリック',
        '強度インジケーターで安全性を確認'
      ]
    },
    {
      name: 'Timestamp Converter',
      path: '/tools/timestamp',
      description: 'UNIXタイムスタンプと日付の変換',
      usage: [
        'タイムスタンプまたは日付を入力',
        '自動的に相互変換されます',
        '現在時刻ボタンで最新の値を取得',
        'タイムゾーンとフォーマットを選択可能'
      ]
    },
    {
      name: 'Lorem Ipsum Generator',
      path: '/tools/lorem',
      description: 'ダミーテキストの生成',
      usage: [
        '生成する段落数を指定',
        '1段落あたりの単語数を設定',
        'HTML形式での出力も可能',
        'コピーボタンで簡単に取得'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">使い方ガイド</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
          <CardDescription>
            すべてのツールは無料で、ブラウザ上で動作します。データはサーバーに送信されず、すべての処理はローカルで行われます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">共通機能</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                <li>コピーボタン：結果をワンクリックでクリップボードにコピー</li>
                <li>クリアボタン：入力内容をリセット</li>
                <li>レスポンシブデザイン：モバイルでも快適に利用可能</li>
                <li>ダークモード対応（一部ツール）</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {tools.map((tool) => (
          <Card key={tool.path}>
            <CardHeader>
              <CardTitle>
                <Link href={tool.path} className="hover:text-blue-600">
                  {tool.name}
                </Link>
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-inside list-decimal space-y-1 text-sm text-gray-600">
                {tool.usage.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              <div className="mt-4">
                <Link
                  href={tool.path}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  ツールを使ってみる →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>ヒント</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
            <li>ブックマークに追加して、すぐにアクセスできるようにしましょう</li>
            <li>複数のツールを組み合わせて使うことで、より効率的な作業が可能です</li>
            <li>ブラウザの履歴から過去の作業を確認できます</li>
            <li>最新のブラウザを使用することで、最高のパフォーマンスが得られます</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}