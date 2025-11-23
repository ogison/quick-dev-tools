'use client';

import { Check, Copy, Download, RefreshCw, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useCallback } from 'react';

import CommonLayoutWithHeader from '@/components/layout/CommonLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';

import {
  generateMultipleUUIDs,
  formatUUID,
  removeHyphens,
} from '../utils/uuid-generator';

type UUIDVersion = 'v1' | 'v4' | 'nil';
type UUIDCase = 'uppercase' | 'lowercase';

export function UUIDGeneratorTool() {
  const t = useTranslations('uuidGeneratorTool');
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<UUIDVersion>('v4');
  const [count, setCount] = useState<number>(1);
  const [uuidCase, setUuidCase] = useState<UUIDCase>('lowercase');
  const [includeHyphens, setIncludeHyphens] = useState<boolean>(true);
  const [copied, setCopied] = useState<{ [key: number]: boolean }>({});
  const [allCopied, setAllCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    let generatedUuids = generateMultipleUUIDs(count, version);

    // Apply formatting
    generatedUuids = generatedUuids.map((uuid) => {
      let formatted = formatUUID(uuid, uuidCase);
      if (!includeHyphens) {
        formatted = removeHyphens(formatted);
      }
      return formatted;
    });

    setUuids(generatedUuids);
    setCopied({});
    setAllCopied(false);
  }, [count, version, uuidCase, includeHyphens]);

  const handleCopy = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopied((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopied((prev) => {
          const newCopied = { ...prev };
          delete newCopied[index];
          return newCopied;
        });
      }, 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = uuid;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopied((prev) => {
          const newCopied = { ...prev };
          delete newCopied[index];
          return newCopied;
        });
      }, 2000);
    }
  };

  const handleCopyAll = async () => {
    const allUuidsText = uuids.join('\n');
    try {
      await navigator.clipboard.writeText(allUuidsText);
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = allUuidsText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${version}-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setUuids([]);
    setCopied({});
    setAllCopied(false);
  };

  const handleQuickGenerate = (quickVersion: UUIDVersion) => {
    setVersion(quickVersion);
    let generatedUuids = generateMultipleUUIDs(count, quickVersion);

    // Apply formatting
    generatedUuids = generatedUuids.map((uuid) => {
      let formatted = formatUUID(uuid, uuidCase);
      if (!includeHyphens) {
        formatted = removeHyphens(formatted);
      }
      return formatted;
    });

    setUuids(generatedUuids);
    setCopied({});
    setAllCopied(false);
  };

  return (
    <TooltipProvider>
      <CommonLayoutWithHeader
        title={t('title')}
        description={t('description')}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: t('title'), isCurrentPage: true },
        ]}
      >
        <Card className="border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-8">
            <Tabs defaultValue="generator" className="w-full">
              <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2 text-black dark:text-white">
                <TabsTrigger value="generator">{t('generator')}</TabsTrigger>
                <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
              </TabsList>

              <TabsContent value="generator" className="space-y-6">
                {/* Quick Generate Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={() => handleQuickGenerate('v4')}
                    variant={version === 'v4' ? 'default' : 'outline'}
                    className="flex-1 min-w-[150px]"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t('generateV4')}
                  </Button>
                  <Button
                    onClick={() => handleQuickGenerate('v1')}
                    variant={version === 'v1' ? 'default' : 'outline'}
                    className="flex-1 min-w-[150px]"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t('generateV1')}
                  </Button>
                  <Button
                    onClick={() => handleQuickGenerate('nil')}
                    variant={version === 'nil' ? 'default' : 'outline'}
                    className="flex-1 min-w-[150px]"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t('generateNil')}
                  </Button>
                </div>

                {/* Generation Controls */}
                <div className="flex gap-3 items-center justify-center">
                  <Button
                    onClick={handleGenerate}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    {t('generate')}
                  </Button>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('generationCount')}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={count}
                      onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                      className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Generated UUIDs Display */}
                {uuids.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                        {t('generatedUUIDs')} ({uuids.length}{t('items')})
                      </label>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCopyAll}
                          variant="outline"
                          size="sm"
                          className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                          {allCopied ? (
                            <>
                              <Check className="mr-2 h-4 w-4 text-green-600" />
                              {t('copied')}
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              {t('copyAll')}
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          size="sm"
                          className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {t('download')}
                        </Button>
                        <Button
                          onClick={handleClear}
                          variant="outline"
                          size="sm"
                          className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('clear')}
                        </Button>
                      </div>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900">
                      <div className="space-y-2">
                        {uuids.map((uuid, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-3 rounded-md bg-white p-3 dark:bg-gray-800"
                          >
                            <code className="flex-1 font-mono text-sm text-gray-800 dark:text-gray-200">
                              {uuid}
                            </code>
                            <Button
                              onClick={() => handleCopy(uuid, index)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              {copied[index] ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {uuids.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-600 dark:bg-gray-900">
                    <p className="text-gray-500 dark:text-gray-400">
                      {t('clickToGenerate')}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <label className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      {t('uuidVersion')}
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="version"
                          value="v4"
                          checked={version === 'v4'}
                          onChange={(e) => setVersion(e.target.value as UUIDVersion)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium">{t('v4Recommended')}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {t('v4Description')}
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="version"
                          value="v1"
                          checked={version === 'v1'}
                          onChange={(e) => setVersion(e.target.value as UUIDVersion)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium">{t('v1Title')}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {t('v1Description')}
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="version"
                          value="nil"
                          checked={version === 'nil'}
                          onChange={(e) => setVersion(e.target.value as UUIDVersion)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium">{t('nilTitle')}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {t('nilDescription')}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      {t('formatSettings')}
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeHyphens}
                          onChange={(e) => setIncludeHyphens(e.target.checked)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium">{t('includeHyphens')}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {t('standardFormat')}
                          </div>
                        </div>
                      </label>

                      <div className="pl-7">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          {t('caseSettings')}
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="case"
                              value="lowercase"
                              checked={uuidCase === 'lowercase'}
                              onChange={(e) => setUuidCase(e.target.value as UUIDCase)}
                              className="h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm">{t('lowercase')}</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="case"
                              value="uppercase"
                              checked={uuidCase === 'uppercase'}
                              onChange={(e) => setUuidCase(e.target.value as UUIDCase)}
                              className="h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm">{t('uppercase')}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{t('aboutUUID')}</h3>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <li>{t('uuidInfo1')}</li>
                      <li>{t('uuidInfo2')}</li>
                      <li>{t('uuidInfo3')}</li>
                      <li>{t('uuidInfo4')}</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">{t('usageExamples')}</h3>
                    <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                      <li>• <strong>{t('usageDatabase')}</strong> {t('usageDatabaseDesc')}</li>
                      <li>• <strong>{t('usageAPI')}</strong> {t('usageAPIDesc')}</li>
                      <li>• <strong>{t('usageSession')}</strong> {t('usageSessionDesc')}</li>
                      <li>• <strong>{t('usageFile')}</strong> {t('usageFileDesc')}</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </CommonLayoutWithHeader>
    </TooltipProvider>
  );
}
