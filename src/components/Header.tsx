import { Home } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header
      className={`sticky top-0 z-50 border-b border-gray-200 bg-white text-black backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80 dark:text-white`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 text-xl font-bold">
            <Home className="h-5 w-5" />
            Tooly
          </Link>
        </div>
      </div>
    </header>
  );
}
