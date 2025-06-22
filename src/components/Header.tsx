'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, ChevronDown, Settings, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import SearchModal from '@/components/search/SearchModal';
import { useSearchShortcuts } from '@/lib/search/search-hooks';
import type { Tool } from '@/features/tools/types';

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
    { id: 'password', name: 'パスワード', description: 'パスワード生成器', href: '/tools/password' },
    { id: 'timestamp', name: 'タイムスタンプ', description: 'タイムスタンプ変換', href: '/tools/timestamp' },
    { id: 'lorem', name: 'ダミーテキスト', description: 'ダミーテキスト生成', href: '/tools/lorem' },
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
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">開発ツール</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">開発者向けユーティリティ</p>
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
                            <div className="text-xs text-muted-foreground">{item.description}</div>
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
              className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">検索</span>
              <div className="hidden md:flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
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
            <div className="px-2 pt-2 pb-3 space-y-1 border-t">
              {navigationItems.map((item) => (
                <Link key={item.id} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={isActive(item.href) ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
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