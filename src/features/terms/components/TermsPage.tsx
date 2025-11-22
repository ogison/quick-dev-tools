'use client';

import { FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import CommonLayoutWithHeader from '@/components/layout/CommonLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 利用規約の各セクション
const TERMS_SECTIONS = [
  {
    id: 'application',
    title: '第1条（適用）',
    content: [
      '本利用規約は、ユーザーと当サービス運営者との間の当サービスの利用に関わる一切の関係に適用されるものとします。',
      '当サービス運営者は本利用規約のほか、ご利用にあたってのルール等、各種の定め（以下、「個別規定」といいます。）をすることがあります。これらの個別規定はその名称のいかんに関わらず、本利用規約の一部を構成するものとします。',
      '本利用規約の規定が前条の個別規定の規定と矛盾する場合には、個別規定において特段の定めなき限り、個別規定の規定が優先されるものとします。',
    ],
  },
  {
    id: 'registration',
    title: '第2条（利用登録）',
    content: [
      '当サービスは、利用登録なしでご利用いただけます。ユーザーは、当サービスにアクセスした時点で、本利用規約に同意したものとみなされます。',
    ],
  },
  {
    id: 'prohibited',
    title: '第3条（禁止事項）',
    content: ['ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません：'],
    list: [
      '法令または公序良俗に違反する行為',
      '犯罪行為に関連する行為',
      '当サービスの内容等、当サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為',
      '当サービス運営者、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為',
      '当サービスによって得られた情報を商業的に利用する行為',
      '当サービスの運営を妨害するおそれのある行為',
      '不正アクセスをし、またはこれを試みる行為',
      '他のユーザーに関する個人情報等を収集または蓄積する行為',
      '不正な目的を持って当サービスを利用する行為',
      '当サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為',
      'その他、当サービス運営者が不適切と判断する行為',
    ],
  },
  {
    id: 'service-suspension',
    title: '第4条（本サービスの提供の停止等）',
    content: [
      '当サービス運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします：',
    ],
    list: [
      '本サービスにかかるコンピュータシステムの保守点検または更新を行う場合',
      '地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合',
      'コンピュータまたは通信回線等が事故により停止した場合',
      'その他、当サービス運営者が本サービスの提供が困難と判断した場合',
    ],
    additionalContent: [
      '当サービス運営者は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。',
    ],
  },
  {
    id: 'copyright',
    title: '第5条（著作権）',
    content: [
      'ユーザーは、自ら著作権等の必要な知的財産権を有するか、または必要な権利者の許諾を得た情報のみ、本サービスを利用し入力または編集することができるものとします。',
      '当サービスおよび当サービスに関連する著作権その他の知的財産権は当サービス運営者または当サービス運営者にその利用を許諾した権利者に帰属し、本利用規約に基づく本サービスの利用許諾は、当サービスに関連する当サービス運営者または当サービス運営者にその利用を許諾した権利者の著作権その他の知的財産権を何ら譲渡するものではありません。',
    ],
  },
  {
    id: 'disclaimer',
    title: '第6条（免責事項）',
    content: [
      '当サービス運営者は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。',
      '当サービス運営者は、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。',
      '当サービス運営者は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。',
    ],
  },
  {
    id: 'privacy',
    title: '第7条（個人情報の取扱い）',
    content: [
      '当サービス運営者は、本サービスの利用によって取得する個人情報については、当サービス運営者のプライバシーポリシーに従い適切に取り扱うものとします。',
    ],
  },
  {
    id: 'changes',
    title: '第8条（利用規約の変更）',
    content: [
      '当サービス運営者は、ユーザーの個別の同意を要せず、本利用規約を変更することができるものとします。',
      '本利用規約の変更は、当サービス内での通知により効力を生じるものとします。',
    ],
  },
  {
    id: 'jurisdiction',
    title: '第9条（準拠法・裁判管轄）',
    content: [
      '本利用規約の解釈にあたっては、日本法を準拠法とします。',
      '本サービスに関して紛争が生じた場合には、当サービス運営者の本店所在地を管轄する裁判所を専属的合意管轄とします。',
    ],
  },
];

// よくある質問
const FAQ_ITEMS = [
  {
    id: 'what-is-service',
    question: 'このサービスは何ですか？',
    answer:
      'QuickDevToolsは、開発者向けの便利なツールを集めたWebサービスです。JSON フォーマッター、Base64エンコーダー、URLエンコーダーなど、日常的な開発作業で使用するツールを無料で提供しています。',
  },
  {
    id: 'registration-required',
    question: '利用するのに登録は必要ですか？',
    answer:
      'いいえ、ユーザー登録は必要ありません。Webサイトにアクセスするだけで、すべてのツールを無料でご利用いただけます。',
  },
  {
    id: 'data-security',
    question: '入力したデータは安全ですか？',
    answer:
      'はい、入力されたデータはすべてお使いのブラウザ内で処理され、サーバーには送信されません。ページを離れると、すべてのデータは自動的に削除されます。',
  },
  {
    id: 'browser-support',
    question: '対応しているブラウザは？',
    answer:
      'Chrome、Firefox、Safari、Edgeなど、現代的なWebブラウザであればご利用いただけます。JavaScriptが有効になっている必要があります。',
  },
  {
    id: 'commercial-use',
    question: '商用利用は可能ですか？',
    answer:
      '個人・商用問わず無料でご利用いただけます。ただし、サービス自体を再配布したり、コピーサイトを作成することは禁止されています。',
  },
  {
    id: 'feature-request',
    question: '新しい機能の追加をリクエストできますか？',
    answer:
      'はい、お問い合わせフォームから機能追加のご要望をお送りください。すべてのリクエストにお応えできるわけではありませんが、検討させていただきます。',
  },
];

interface CollapsibleSectionProps {
  section: (typeof TERMS_SECTIONS)[0];
  isExpanded: boolean;
  onToggle: () => void;
}

function CollapsibleSection({ section, isExpanded, onToggle }: CollapsibleSectionProps) {
  return (
    <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3 text-left transition-colors hover:text-blue-600 dark:hover:text-blue-400"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {section.content.map((paragraph, index) => (
            <p key={index} className="text-gray-600 dark:text-gray-300">
              {paragraph}
            </p>
          ))}
          {section.list && (
            <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-300">
              {section.list.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          {section.additionalContent &&
            section.additionalContent.map((paragraph, index) => (
              <p key={index} className="text-gray-600 dark:text-gray-300">
                {paragraph}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}

interface CollapsibleFAQProps {
  item: (typeof FAQ_ITEMS)[0];
  isExpanded: boolean;
  onToggle: () => void;
}

function CollapsibleFAQ({ item, isExpanded, onToggle }: CollapsibleFAQProps) {
  return (
    <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3 text-left transition-colors hover:text-blue-600 dark:hover:text-blue-400"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.question}</h3>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="mt-3">
          <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function TermsPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  const expandAllSections = () => {
    setExpandedSections(new Set(TERMS_SECTIONS.map((section) => section.id)));
  };

  const collapseAllSections = () => {
    setExpandedSections(new Set());
  };

  const expandAllFAQs = () => {
    setExpandedFAQs(new Set(FAQ_ITEMS.map((item) => item.id)));
  };

  const collapseAllFAQs = () => {
    setExpandedFAQs(new Set());
  };

  return (
    <CommonLayoutWithHeader
      title="利用規約"
      description="QuickDevToolsの利用規約とよくある質問をご確認ください。"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: '利用規約', isCurrentPage: true },
      ]}
    >

      <Card className="border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="p-8">
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2 text-black dark:text-white">
              <TabsTrigger value="terms">利用規約</TabsTrigger>
              <TabsTrigger value="faq">よくある質問</TabsTrigger>
            </TabsList>

            <TabsContent value="terms" className="space-y-6">
                <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <FileText className="mr-2 inline h-4 w-4" />
                    最終更新日：2025年6月28日
                  </p>
                </div>

                <div className="mb-6 flex gap-2">
                  <Button
                    onClick={expandAllSections}
                    variant="outline"
                    size="sm"
                    className="text-sm"
                  >
                    すべて展開
                  </Button>
                  <Button
                    onClick={collapseAllSections}
                    variant="outline"
                    size="sm"
                    className="text-sm"
                  >
                    すべて折りたたみ
                  </Button>
                </div>

                <div className="mb-6">
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    QuickDevTools（以下、「当サービス」）をご利用いただき、ありがとうございます。
                    本利用規約は、当サービスの利用に関する条件を定めたものです。
                    当サービスをご利用になる場合には、本利用規約に同意いただいたものとみなします。
                  </p>
                </div>

                <div className="space-y-4">
                  {TERMS_SECTIONS.map((section) => (
                    <CollapsibleSection
                      key={section.id}
                      section={section}
                      isExpanded={expandedSections.has(section.id)}
                      onToggle={() => toggleSection(section.id)}
                    />
                  ))}
                </div>

                <div className="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    本利用規約に関するご質問やご不明な点がございましたら、以下よりお問い合わせください：
                  </p>
                  <a
                    href="/contact"
                    className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    お問い合わせフォーム
                  </a>
                </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
                <div className="mb-6 flex gap-2">
                  <Button onClick={expandAllFAQs} variant="outline" size="sm" className="text-sm">
                    すべて展開
                  </Button>
                  <Button onClick={collapseAllFAQs} variant="outline" size="sm" className="text-sm">
                    すべて折りたたみ
                  </Button>
                </div>

                <div className="space-y-4">
                  {FAQ_ITEMS.map((item) => (
                    <CollapsibleFAQ
                      key={item.id}
                      item={item}
                      isExpanded={expandedFAQs.has(item.id)}
                      onToggle={() => toggleFAQ(item.id)}
                    />
                  ))}
                </div>

                <div className="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    他にご質問がございましたら、お気軽にお問い合わせください：
                  </p>
                  <a
                    href="/contact"
                    className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    お問い合わせフォーム
                  </a>
                </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </CommonLayoutWithHeader>
  );
}
