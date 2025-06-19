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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Everything you need for development
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive collection of developer tools to boost your productivity. 
            From JSON formatting to hash generation, all in one place.
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Browse by Category</h3>
          <div className="flex flex-wrap gap-3">
            {[...new Set(tools.map(tool => tool.category))].map(category => (
              <span 
                key={category}
                className="px-4 py-2 bg-white rounded-full text-gray-700 border border-gray-200 shadow-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 cursor-pointer group"
              onClick={() => handleViewChange(tool.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  #{tool.number}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {tool.name}
              </h3>
              
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {tool.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {tool.category}
                </span>
                <div className="text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Quick Access</h3>
          <p className="text-gray-600 mb-6">Most popular tools for daily development tasks</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.slice(0, 4).map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleViewChange(tool.id)}
                className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
              >
                <div className="text-2xl mb-2">{tool.icon}</div>
                <div className="text-sm font-medium text-gray-900">{tool.name}</div>
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
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
    <div className="bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">        
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === tool.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tool.number}. {tool.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {renderToolComponent()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      {currentView === 'home' ? renderHomePage() : renderToolsPage()}
    </div>
  );
}