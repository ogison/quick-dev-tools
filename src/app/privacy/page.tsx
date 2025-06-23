import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">プライバシーポリシー</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>プライバシーポリシー</CardTitle>
          <CardDescription>
            最終更新日：2024年1月1日
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            開発者ツール集（以下、「当サービス」）は、ユーザーのプライバシーを尊重し、
            個人情報の保護に努めています。本プライバシーポリシーは、当サービスにおける
            情報の取り扱いについて説明します。
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. 収集する情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">1.1 個人情報</h3>
              <p className="text-gray-600">
                当サービスは、基本的に個人情報を収集しません。ただし、お問い合わせフォームを
                利用する場合は、以下の情報を収集します：
              </p>
              <ul className="mt-2 list-inside list-disc text-gray-600">
                <li>お名前</li>
                <li>メールアドレス</li>
                <li>お問い合わせ内容</li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-2 font-semibold">1.2 利用情報</h3>
              <p className="text-gray-600">
                当サービスは、サービス改善のために以下の情報を自動的に収集する場合があります：
              </p>
              <ul className="mt-2 list-inside list-disc text-gray-600">
                <li>IPアドレス</li>
                <li>ブラウザの種類とバージョン</li>
                <li>アクセス日時</li>
                <li>参照元URL</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. 情報の利用目的</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              収集した情報は、以下の目的でのみ使用します：
            </p>
            <ul className="list-inside list-disc space-y-1 text-gray-600">
              <li>お問い合わせへの返信</li>
              <li>サービスの改善と新機能の開発</li>
              <li>利用状況の分析</li>
              <li>技術的な問題の解決</li>
              <li>法的要求への対応</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. データの保存と処理</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              当サービスの主要な機能は、すべてお使いのブラウザ内で処理されます：
            </p>
            <ul className="list-inside list-disc space-y-1 text-gray-600">
              <li>入力されたデータは、サーバーに送信されません</li>
              <li>処理結果は、ローカルでのみ生成されます</li>
              <li>ページを離れると、すべてのデータは自動的に削除されます</li>
              <li>ブラウザのローカルストレージを使用して、設定を保存する場合があります</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. クッキー（Cookie）の使用</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              当サービスでは、以下の目的でクッキーを使用する場合があります：
            </p>
            <ul className="list-inside list-disc space-y-1 text-gray-600">
              <li>ユーザー設定の保存（テーマ、言語など）</li>
              <li>アクセス解析（Google Analytics等）</li>
              <li>サービスの品質向上</li>
            </ul>
            <p className="mt-4 text-gray-600">
              ブラウザの設定により、クッキーを無効にすることができますが、
              一部の機能が利用できなくなる場合があります。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. 第三者への情報提供</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              当サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：
            </p>
            <ul className="list-inside list-disc space-y-1 text-gray-600">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく開示要求がある場合</li>
              <li>人の生命、身体または財産の保護のために必要な場合</li>
              <li>サービスの運営に必要な範囲で、業務委託先に提供する場合</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. セキュリティ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              当サービスは、情報の安全性を確保するため、以下の対策を実施しています：
            </p>
            <ul className="list-inside list-disc space-y-1 text-gray-600">
              <li>SSL/TLS暗号化通信の使用</li>
              <li>定期的なセキュリティ更新</li>
              <li>アクセス制御の実施</li>
              <li>データの最小限の収集</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. 外部サービスの利用</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              当サービスは、以下の外部サービスを利用する場合があります：
            </p>
            <ul className="list-inside list-disc space-y-1 text-gray-600">
              <li>Google Analytics（アクセス解析）</li>
              <li>その他の分析ツール</li>
            </ul>
            <p className="mt-4 text-gray-600">
              これらのサービスは独自のプライバシーポリシーに従って情報を収集・処理します。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. 子供のプライバシー</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              当サービスは、13歳未満の子供から意図的に個人情報を収集しません。
              13歳未満の方は、保護者の同意を得てからサービスをご利用ください。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. プライバシーポリシーの変更</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              当サービスは、必要に応じて本プライバシーポリシーを変更することがあります。
              重要な変更がある場合は、サービス内で通知します。変更後のプライバシーポリシーは、
              当ページに掲載した時点で効力を生じるものとします。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. お問い合わせ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              本プライバシーポリシーに関するご質問やご不明な点がございましたら、
              以下よりお問い合わせください：
            </p>
            <a
              href="/contact"
              className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              お問い合わせフォーム
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}