'use client';

import { Menu, ChevronDown, Settings, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import SearchModal from '@/components/search/SearchModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import type { Tool } from '@/features/tools/types';
import { useSearchShortcuts } from '@/lib/search/search-hooks';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { id: 'home', name: 'ホーム', description: 'すべての開発者ツール', href: '/' },
    { id: 'json', name: 'JSON', description: 'JSON整形ツール', href: '/tools/json' },
    { id: 'base64', name: 'Base64', description: 'Base64エンコーダー', href: '/tools/base64' },
    { id: 'url', name: 'URL', description: 'URLエンコーダー', href: '/tools/url-encoder' },
    { id: 'hash', name: 'ハッシュ', description: 'ハッシュ生成器', href: '/tools/hash-generator' },
    { id: 'regex', name: '正規表現', description: '正規表現テスター', href: '/tools/regex' },
    { id: 'color', name: 'カラー', description: 'カラーパレット生成', href: '/tools/color' },
    { id: 'qr', name: 'QRコード', description: 'QRコード生成器', href: '/tools/qr' },
    {
      id: 'password',
      name: 'パスワード',
      description: 'パスワード生成器',
      href: '/tools/password',
    },
    {
      id: 'timestamp',
      name: 'タイムスタンプ',
      description: 'タイムスタンプ変換',
      href: '/tools/timestamp',
    },
    {
      id: 'lorem',
      name: 'ダミーテキスト',
      description: 'ダミーテキスト生成',
      href: '/tools/lorem',
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  // 検索モーダルの開閉
  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  // ツール選択時の処理
  const handleSelectTool = (tool: Tool) => {
    router.push(tool.href);
  };

  // キーボードショートカットの設定
  useSearchShortcuts(openSearchModal);

  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-3 transition-opacity hover:opacity-80"
            >
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Settings className="text-primary-foreground h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">開発ツール</h1>
                <p className="text-muted-foreground hidden text-xs sm:block">
                  開発者向けユーティリティ
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              {navigationItems.slice(0, 6).map((item) => (
                <NavigationMenuItem key={item.id}>
                  <Link href={item.href}>
                    <Button
                      variant={isActive(item.href) ? 'default' : 'ghost'}
                      size="sm"
                      title={item.description}
                    >
                      {item.name}
                    </Button>
                  </Link>
                </NavigationMenuItem>
              ))}

              {/* More Tools Dropdown */}
              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      その他
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {navigationItems.slice(6).map((item) => (
                      <DropdownMenuItem key={item.id} asChild>
                        <Link href={item.href} className={isActive(item.href) ? 'bg-accent' : ''}>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-muted-foreground text-xs">{item.description}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search and Theme toggle and Mobile menu button */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={openSearchModal}
              className="text-muted-foreground hover:text-foreground hidden items-center gap-2 sm:flex"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">検索</span>
              <div className="bg-muted hidden items-center gap-1 rounded px-2 py-1 text-xs md:flex">
                <span>⌘</span>
                <span>K</span>
              </div>
            </Button>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={openSearchModal}
              className="sm:hidden"
              aria-label="検索"
            >
              <Search className="h-5 w-5" />
            </Button>

            <ThemeToggle />
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 border-t px-2 pt-2 pb-3">
              {navigationItems.map((item) => (
                <Link key={item.id} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={isActive(item.href) ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-muted-foreground text-sm">{item.description}</div>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        onSelectTool={handleSelectTool}
      />
    </header>
  );
}
