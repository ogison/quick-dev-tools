import { X } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and links */}
          <div className="flex items-center space-x-6">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Tooly</span>
            <nav className="flex items-center space-x-6">
              <a
                href="/privacy"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                プライバシー
              </a>
              <a
                href="/terms"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                利用規約
              </a>
            </nav>
          </div>

          {/* Right side - Help, X, and language */}
          <div className="flex items-center space-x-4">
            <a
              href="https://x.com/ogison999"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)で最新情報をチェック"
              className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <X className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 text-center text-gray-400">
        <p>&copy; 2025 Tooly All rights reserved.</p>
      </div>
    </footer>
  );
}
