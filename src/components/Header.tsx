'use client';

import { useState } from 'react';
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

interface HeaderProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
}

export default function Header({ currentView = 'home', onViewChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', name: 'Home', description: 'All Developer Tools' },
    { id: 'json', name: 'JSON', description: 'JSON Formatter' },
    { id: 'base64', name: 'Base64', description: 'Base64 Encoder/Decoder' },
    { id: 'url', name: 'URL', description: 'URL Encoder/Decoder' },
    { id: 'hash', name: 'Hash', description: 'Hash Generator' },
    { id: 'regex', name: 'Regex', description: 'Regular Expression Tester' },
    { id: 'color', name: 'Colors', description: 'Color Palette Generator' },
    { id: 'qr', name: 'QR Code', description: 'QR Code Generator' },
    { id: 'password', name: 'Password', description: 'Password Generator' },
    { id: 'timestamp', name: 'Timestamp', description: 'Timestamp Converter' },
    { id: 'lorem', name: 'Lorem', description: 'Lorem Ipsum Generator' },
  ];

  const handleNavigation = (viewId: string) => {
    if (onViewChange) {
      onViewChange(viewId);
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('home')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">DevTools</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Developer Utilities</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              {navigationItems.slice(0, 6).map((item) => (
                <NavigationMenuItem key={item.id}>
                  <Button
                    variant={currentView === item.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleNavigation(item.id)}
                    title={item.description}
                  >
                    {item.name}
                  </Button>
                </NavigationMenuItem>
              ))}
              
              {/* More Tools Dropdown */}
              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      More
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {navigationItems.slice(6).map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => handleNavigation(item.id)}
                        className={currentView === item.id ? 'bg-accent' : ''}
                      >
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
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
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => handleNavigation(item.id)}
                >
                  <div className="text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}