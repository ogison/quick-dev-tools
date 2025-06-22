import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">開発者ツール集</h3>
            <p className="text-gray-300 mb-4">
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
            <h4 className="font-semibold mb-3">ツール</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  JSON整形
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Base64変換
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  ハッシュ生成
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  QRコード
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">サポート</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  使い方
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  お問い合わせ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  プライバシー
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2024 開発者ツール集. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
