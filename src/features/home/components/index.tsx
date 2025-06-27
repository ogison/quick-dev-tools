import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const tools = [
    {
      id: 'format',
      title: 'なんでもフォーマッター',
      description: 'Format and validate JSON data.',
      href: '/tools/format',
      icon: (
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-900 p-8">
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Molecule-like structure */}
              <div className="absolute top-0 left-0 h-12 w-12 rounded-full bg-cyan-400/80"></div>
              <div className="absolute top-8 left-16 h-10 w-10 rounded-full bg-cyan-500/60"></div>
              <div className="absolute top-16 left-8 h-8 w-8 rounded-full bg-cyan-300/70"></div>
              {/* Connecting lines */}
              <svg className="absolute inset-0 h-24 w-24" viewBox="0 0 100 100">
                <line
                  x1="24"
                  y1="24"
                  x2="64"
                  y2="32"
                  stroke="rgba(34, 211, 238, 0.5)"
                  strokeWidth="2"
                />
                <line
                  x1="24"
                  y1="24"
                  x2="32"
                  y2="64"
                  stroke="rgba(34, 211, 238, 0.5)"
                  strokeWidth="2"
                />
                <line
                  x1="64"
                  y1="32"
                  x2="32"
                  y2="64"
                  stroke="rgba(34, 211, 238, 0.5)"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'timestamp',
      title: 'Unix Timestamp Converter',
      description: 'Convert Unix timestamps to human-readable dates and vice versa.',
      href: '/tools/timestamp',
      icon: (
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-50 p-6">
          <div className="space-y-2 font-mono text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>1735689600</span>
              <span className="text-gray-400">1 minute ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span>1735603200</span>
              <span className="text-gray-400">1 day ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span>1733011200</span>
              <span className="text-gray-400">1 month ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span>1704153600</span>
              <span className="text-gray-400">1 year ago</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'url-encoder',
      title: 'URL Encoder',
      description: 'Encode and decode URLs.',
      href: '/tools/url-encoder',
      icon: (
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-emerald-900 p-6">
          <div className="rounded-lg bg-black/20 p-4 font-mono text-xs text-emerald-300">
            <div className="space-y-1">
              <div>{'script {"'}</div>
              <div className="pl-4">{'www.example.com'}</div>
              <div className="pl-4">{'&name=John&id=123&category'}</div>
              <div className="pl-4">{'Www.example.com'}</div>
              <div className="pl-4">{'&id=789&name=Jane'}</div>
              <div className="pl-4">{'Swww.example.com'}</div>
              <div className="pl-4">{'https://www.example.com'}</div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold">Tooly</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            開発者のためのツールコレクション
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Tools</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Card
                key={tool.id}
                className="overflow-hidden border-gray-200 bg-white transition-transform hover:scale-105 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="aspect-[4/3] w-full">{tool.icon}</div>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">{tool.title}</h3>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {tool.description}
                  </p>
                  <Link href={tool.href}>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Open
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
