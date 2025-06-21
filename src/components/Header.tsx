'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Menu, ChevronDown, Settings } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

          {/* Mobile menu button */}
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
    </header>
  );
}