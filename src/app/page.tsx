'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import JsonFormatter from '@/components/JsonFormatter';
import Base64Encoder from '@/components/Base64Encoder';
import UrlEncoder from '@/components/UrlEncoder';
import HashGenerator from '@/components/HashGenerator';
import RegexTester from '@/components/RegexTester';
import ColorPalette from '@/components/ColorPalette';
import QrGenerator from '@/components/QrGenerator';
import PasswordGenerator from '@/components/PasswordGenerator';
import TimestampConverter from '@/components/TimestampConverter';
import LoremIpsum from '@/components/LoremIpsum';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const [activeTab, setActiveTab] = useState('json');

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    if (view !== 'home') {
      setActiveTab(view);
    }
  };

  const tools = [
    { 
      id: 'json', 
      name: 'JSON整形ツール', 
      number: '1',
      description: 'JSONデータの整形・検証・最小化をシンタックスハイライト付きで',
      icon: '{}',
      category: 'データ処理',
      badge: '人気'
    },
    { 
      id: 'base64', 
      name: 'Base64エンコーダー', 
      number: '2',
      description: 'テキストをBase64に変換、またはBase64文字列をテキストに変換',
      icon: '🔤',
      category: 'エンコーディング',
      badge: '実用'
    },
    { 
      id: 'url', 
      name: 'URLエンコーダー', 
      number: '3',
      description: 'URLの安全なエンコード・デコードを行います',
      icon: '🌐',
      category: 'エンコーディング',
      badge: '実用'
    },
    { 
      id: 'hash', 
      name: 'ハッシュ生成器', 
      number: '4',
      description: 'MD5、SHA-1、SHA-256、SHA-512のハッシュ値を生成',
      icon: '#',
      category: '暗号化',
      badge: 'セキュリティ'
    },
    { 
      id: 'regex', 
      name: '正規表現テスター', 
      number: '5',
      description: '正規表現をテストし、リアルタイムでマッチ結果を確認',
      icon: '.*',
      category: 'テキスト処理',
      badge: '開発'
    },
    { 
      id: 'color', 
      name: 'カラーパレット生成', 
      number: '6',
      description: '調和の取れた美しいカラーパレットを自動生成',
      icon: '🎨',
      category: 'デザイン',
      badge: 'クリエイティブ'
    },
    { 
      id: 'qr', 
      name: 'QRコード生成器', 
      number: '7',
      description: 'テキストやURLから簡単にQRコードを生成',
      icon: '▦',
      category: 'ユーティリティ',
      badge: '便利'
    },
    { 
      id: 'password', 
      name: 'パスワード生成器', 
      number: '8',
      description: 'カスタム条件で安全なパスワードを生成',
      icon: '🔐',
      category: 'セキュリティ',
      badge: 'セキュリティ'
    },
    { 
      id: 'timestamp', 
      name: 'タイムスタンプ変換', 
      number: '9',
      description: 'Unixタイムスタンプと日時の相互変換',
      icon: '⏰',
      category: 'ユーティリティ',
      badge: '実用'
    },
    { 
      id: 'lorem', 
      name: 'ダミーテキスト生成', 
      number: '10',
      description: 'デザインや開発用のプレースホルダーテキストを生成',
      icon: '📝',
      category: 'コンテンツ',
      badge: 'デザイン'
    }
  ];

  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              開発者ツール集
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              開発効率を最大化する、プロフェッショナルな無料ツールコレクション
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
                onClick={() => handleViewChange('json')}
              >
                無料で始める
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg"
              >
                ツール一覧を見る
              </Button>
            </div>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-300/30 rounded-full blur-lg"></div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              なぜ開発者に選ばれるのか
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              シンプルで直感的、そして高機能。毎日の開発作業を効率化します。
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">高速処理</h3>
              <p className="text-muted-foreground">ブラウザ上で瞬時に処理。サーバーへのアップロード不要で安全</p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">完全無料</h3>
              <p className="text-muted-foreground">すべての機能が無料。アカウント登録も不要です</p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">レスポンシブ</h3>
              <p className="text-muted-foreground">PC・タブレット・スマートフォンで快適に利用可能</p>
            </Card>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">カテゴリから選ぶ</h2>
            <p className="text-muted-foreground">用途に応じてツールを分類しています</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[...new Set(tools.map(tool => tool.category))].map(category => (
              <Button 
                key={category}
                variant="outline"
                className="rounded-full px-6 py-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Tools Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">開発ツール一覧</h2>
            <p className="text-muted-foreground">プロフェッショナルな開発に必要なツールを厳選</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Card
                key={tool.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg"
                onClick={() => handleViewChange(tool.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {tool.icon}
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-1 rounded-full">
                        {tool.badge}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        #{tool.number}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors text-lg">
                    {tool.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {tool.category}
                    </span>
                    <div className="text-blue-600 group-hover:translate-x-1 transition-transform duration-300 font-bold">
                      →
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Access */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">人気ツール</CardTitle>
              <CardDescription className="text-base">
                多くの開発者に愛用されている定番ツール
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tools.slice(0, 4).map((tool) => (
                  <Button
                    key={tool.id}
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center p-6 hover:bg-white hover:shadow-md transition-all bg-white/50"
                    onClick={() => handleViewChange(tool.id)}
                  >
                    <div className="text-3xl mb-3">{tool.icon}</div>
                    <div className="text-sm font-semibold">{tool.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{tool.badge}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">開発者ツール集</h3>
              <p className="text-gray-300 mb-4">
                開発者の生産性向上のために作られた、無料で使える高品質なWebツールコレクションです。
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="border-gray-600 text-white hover:bg-gray-700">
                  <span>📧</span>
                </Button>
                <Button variant="outline" size="icon" className="border-gray-600 text-white hover:bg-gray-700">
                  <span>🐙</span>
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">ツール</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">JSON整形</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Base64変換</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ハッシュ生成</a></li>
                <li><a href="#" className="hover:text-white transition-colors">QRコード</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">サポート</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">使い方</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">プライバシー</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 開発者ツール集. Built with Next.js and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );

  const renderToolComponent = () => {
    switch (activeTab) {
      case 'json': return <JsonFormatter />;
      case 'base64': return <Base64Encoder />;
      case 'url': return <UrlEncoder />;
      case 'hash': return <HashGenerator />;
      case 'regex': return <RegexTester />;
      case 'color': return <ColorPalette />;
      case 'qr': return <QrGenerator />;
      case 'password': return <PasswordGenerator />;
      case 'timestamp': return <TimestampConverter />;
      case 'lorem': return <LoremIpsum />;
      default: return <JsonFormatter />;
    }
  };

  const renderToolsPage = () => (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">        
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                variant={activeTab === tool.id ? 'default' : 'outline'}
              >
                {tool.number}. {tool.name}
              </Button>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {renderToolComponent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      {currentView === 'home' ? renderHomePage() : renderToolsPage()}
    </div>
  );
}