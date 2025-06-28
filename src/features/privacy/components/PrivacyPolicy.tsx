'use client';

import { Home, Shield } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { PRIVACY_POLICY_SECTIONS, POLICY_METADATA } from '../constants/policy-content';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <nav className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          <ol className="list-reset flex">
            <li>
              <Link href="/home" className="text-blue-600 hover:underline">
                <Home className="inline h-4 w-4" />
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="font-medium text-gray-900 dark:text-white">プライバシーポリシー</li>
          </ol>
        </nav>

        <div className="mb-12 text-left">
          <h1 className="mb-4 text-5xl font-bold">プライバシーポリシー</h1>
          <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            個人情報の取り扱いとデータ保護に関する方針について説明しています。
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            最終更新日：{POLICY_METADATA.lastUpdated}
          </p>
        </div>

        <div className="space-y-6">
          {/* 概要セクション */}
          <Card className="border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <CardTitle>{PRIVACY_POLICY_SECTIONS[0].title}</CardTitle>
                  <CardDescription>{POLICY_METADATA.lastUpdated}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                {PRIVACY_POLICY_SECTIONS[0].content.text}
              </p>
            </CardContent>
          </Card>

          {/* その他のセクション */}
          {PRIVACY_POLICY_SECTIONS.slice(1).map((section) => (
            <Card
              key={section.id}
              className="border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <CardHeader>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.content.text && (
                  <p className="text-gray-600 dark:text-gray-400">{section.content.text}</p>
                )}

                {section.content.list && (
                  <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
                    {section.content.list.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.content.subsections && (
                  <div className="space-y-4">
                    {section.content.subsections.map((subsection, index) => (
                      <div key={index}>
                        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                          {subsection.title}
                        </h3>
                        <p className="mb-2 text-gray-600 dark:text-gray-400">{subsection.text}</p>
                        {subsection.list && (
                          <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
                            {subsection.list.map((item, listIndex) => (
                              <li key={listIndex}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.id === 'cookies' && (
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    ブラウザの設定により、クッキーを無効にすることができますが、
                    一部の機能が利用できなくなる場合があります。
                  </p>
                )}

                {section.id === 'external-services' && (
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    これらのサービスは独自のプライバシーポリシーに従って情報を収集・処理します。
                  </p>
                )}

                {section.id === 'contact' && (
                  <div className="mt-4">
                    <Button
                      asChild
                      className="bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg"
                    >
                      <a href="/contact">
                        <Shield className="mr-2 h-4 w-4" />
                        お問い合わせフォーム
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* 追加情報カード */}
          <Card className="border-blue-200 bg-blue-50 shadow-lg dark:border-blue-800 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Shield className="h-5 w-5" />
                データ保護について
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 dark:text-blue-200">
                当サービスは、お客様のプライバシーを最優先に考えています。
                ツール機能はすべてブラウザ内で処理され、入力データがサーバーに送信されることはありません。
                安心してご利用ください。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
