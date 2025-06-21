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
      name: 'JSON Formatter', 
      number: '1',
      description: 'Format, validate, and minify JSON data with syntax highlighting',
      icon: '{}',
      category: 'Data Processing'
    },
    { 
      id: 'base64', 
      name: 'Base64 Encoder/Decoder', 
      number: '2',
      description: 'Encode text to Base64 or decode Base64 strings back to text',
      icon: '🔤',
      category: 'Encoding'
    },
    { 
      id: 'url', 
      name: 'URL Encoder/Decoder', 
      number: '3',
      description: 'Encode URLs and decode URL-encoded strings safely',
      icon: '🌐',
      category: 'Encoding'
    },
    { 
      id: 'hash', 
      name: 'Hash Generator', 
      number: '4',
      description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes',
      icon: '#',
      category: 'Cryptography'
    },
    { 
      id: 'regex', 
      name: 'Regex Tester', 
      number: '5',
      description: 'Test regular expressions and see matches in real-time',
      icon: '.*',
      category: 'Text Processing'
    },
    { 
      id: 'color', 
      name: 'Color Palette Generator', 
      number: '6',
      description: 'Generate color palettes and harmonious color combinations',
      icon: '🎨',
      category: 'Design'
    },
    { 
      id: 'qr', 
      name: 'QR Code Generator', 
      number: '7',
      description: 'Generate QR codes from text, URLs, or any data',
      icon: '▦',
      category: 'Utilities'
    },
    { 
      id: 'password', 
      name: 'Password Generator', 
      number: '8',
      description: 'Generate secure passwords with custom criteria',
      icon: '🔐',
      category: 'Security'
    },
    { 
      id: 'timestamp', 
      name: 'Timestamp Converter', 
      number: '9',
      description: 'Convert between Unix timestamps and human-readable dates',
      icon: '⏰',
      category: 'Utilities'
    },
    { 
      id: 'lorem', 
      name: 'Lorem Ipsum Generator', 
      number: '10',
      description: 'Generate placeholder text for design and development',
      icon: '📝',
      category: 'Content'
    }
  ];

  const renderHomePage = () => (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Everything you need for development
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive collection of developer tools to boost your productivity. 
            From JSON formatting to hash generation, all in one place.
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">Browse by Category</h3>
          <div className="flex flex-wrap gap-3">
            {[...new Set(tools.map(tool => tool.category))].map(category => (
              <Button 
                key={category}
                variant="outline"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => handleViewChange(tool.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="text-4xl">
                    {tool.icon}
                  </div>
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                    #{tool.number}
                  </span>
                </div>
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                    {tool.category}
                  </span>
                  <div className="text-primary">
                    →
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-16">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Most popular tools for daily development tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tools.slice(0, 4).map((tool) => (
                <Button
                  key={tool.id}
                  variant="outline"
                  className="h-auto flex flex-col items-center justify-center p-4"
                  onClick={() => handleViewChange(tool.id)}
                >
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <div className="text-sm font-medium">{tool.name}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Developer Tools. Built with Next.js and Tailwind CSS.</p>
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