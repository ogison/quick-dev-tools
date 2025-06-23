import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FAQPage() {
  const faqs = [
    {
      category: '一般的な質問',
      questions: [
        {
          q: 'これらのツールは無料で使えますか？',
          a: 'はい、すべてのツールは完全に無料でご利用いただけます。登録や支払いは一切必要ありません。'
        },
        {
          q: 'データはどこで処理されますか？',
          a: 'すべてのデータ処理はお使いのブラウザ内で行われます。サーバーにデータが送信されることはありませんので、プライバシーが保護されます。'
        },
        {
          q: 'オフラインでも使えますか？',
          a: '初回アクセス後は、多くのツールがオフラインでも動作します。ただし、最新の機能を利用するには、インターネット接続が必要な場合があります。'
        },
        {
          q: 'モバイルデバイスでも使えますか？',
          a: 'はい、すべてのツールはレスポンシブデザインで作られており、スマートフォンやタブレットでも快適にご利用いただけます。'
        }
      ]
    },
    {
      category: '技術的な質問',
      questions: [
        {
          q: '対応しているブラウザは？',
          a: '最新版のChrome、Firefox、Safari、Edgeに対応しています。Internet Explorer 11以前のバージョンはサポートしていません。'
        },
        {
          q: 'ファイルサイズの制限はありますか？',
          a: 'ブラウザのメモリ制限に依存しますが、一般的には50MB以下のファイルを推奨しています。大きなファイルの処理は、ブラウザが遅くなる可能性があります。'
        },
        {
          q: 'APIとして利用できますか？',
          a: '現在、APIは提供していません。すべての機能はWebインターフェース経由でのみ利用可能です。'
        },
        {
          q: 'ソースコードは公開されていますか？',
          a: 'このプロジェクトはオープンソースではありませんが、一部のツールのコアロジックについては、技術ブログで解説しています。'
        }
      ]
    },
    {
      category: 'セキュリティとプライバシー',
      questions: [
        {
          q: '入力したデータは保存されますか？',
          a: 'いいえ、入力されたデータはブラウザのメモリ内でのみ処理され、サーバーに送信・保存されることはありません。ページを離れるとデータは消去されます。'
        },
        {
          q: 'パスワード生成ツールは安全ですか？',
          a: 'はい、暗号学的に安全な乱数生成器を使用しています。生成されたパスワードはブラウザ内でのみ表示され、どこにも送信されません。'
        },
        {
          q: 'クッキーは使用していますか？',
          a: '基本的な設定（テーマなど）を保存するために、必要最小限のローカルストレージを使用しています。トラッキングクッキーは使用していません。'
        },
        {
          q: 'HTTPSは使用していますか？',
          a: 'はい、すべての通信はHTTPSで暗号化されています。これにより、中間者攻撃から保護されます。'
        }
      ]
    },
    {
      category: 'トラブルシューティング',
      questions: [
        {
          q: 'ツールが正しく動作しません',
          a: 'まず、ブラウザのキャッシュをクリアしてページを再読み込みしてください。それでも問題が解決しない場合は、別のブラウザでお試しください。'
        },
        {
          q: 'コピーボタンが機能しません',
          a: 'ブラウザのセキュリティ設定により、クリップボードへのアクセスが制限されている可能性があります。手動でテキストを選択してコピーしてください。'
        },
        {
          q: '文字化けが発生します',
          a: 'エンコーディングの問題の可能性があります。UTF-8でエンコードされたテキストを使用してください。特に日本語を含む場合は注意が必要です。'
        },
        {
          q: '処理が遅いです',
          a: '大量のデータを処理する場合、ブラウザの性能に依存します。データを小さく分割するか、より高性能なデバイスをご使用ください。'
        }
      ]
    },
    {
      category: '機能リクエスト',
      questions: [
        {
          q: '新しい機能をリクエストできますか？',
          a: 'はい、お問い合わせフォームから機能リクエストを送信できます。すべてのリクエストを検討し、多くのユーザーに有益な機能を優先的に実装します。'
        },
        {
          q: 'バグを報告するには？',
          a: 'お問い合わせフォームから、発生した問題の詳細（使用ブラウザ、エラーメッセージ、再現手順など）をお送りください。'
        },
        {
          q: '他の言語に対応していますか？',
          a: '現在は日本語のみ対応していますが、将来的に英語版の提供も検討しています。'
        },
        {
          q: 'デスクトップアプリはありますか？',
          a: '現在はWebアプリケーションのみ提供していますが、PWA（Progressive Web App）として、デスクトップアプリのように使用することができます。'
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">よくある質問（FAQ）</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>開発者ツール集について</CardTitle>
          <CardDescription>
            このFAQページでは、よくお寄せいただく質問と回答をまとめています。
            お探しの情報が見つからない場合は、お問い合わせフォームからご連絡ください。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-8">
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="mb-4 text-2xl font-semibold">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((item, questionIndex) => (
                <Card key={questionIndex}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>さらにサポートが必要ですか？</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            FAQで解決しない問題がある場合は、お気軽にお問い合わせください。
          </p>
          <a
            href="#"
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            お問い合わせフォームへ
          </a>
        </CardContent>
      </Card>
    </div>
  );
}