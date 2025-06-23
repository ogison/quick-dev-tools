import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="mb-4 text-xl font-bold">Tooly</h3>
            <p className="mb-4 text-gray-300">
              開発者の生産性向上のために作られた、無料で使える高品質なWebツールコレクションです。
            </p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <span>📧</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <span>🐙</span>
              </Button>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">ツール</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  JSON整形
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Base64変換
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  ハッシュ生成
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  QRコード
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">サポート</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/how-to-use" className="transition-colors hover:text-white">
                  使い方
                </a>
              </li>
              <li>
                <a href="/faq" className="transition-colors hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="transition-colors hover:text-white">
                  お問い合わせ
                </a>
              </li>
              <li>
                <a href="/privacy" className="transition-colors hover:text-white">
                  プライバシー
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Tooly 開発者ツール集.</p>
        </div>
      </div>
    </footer>
  );
}
