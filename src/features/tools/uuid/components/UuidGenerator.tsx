'use client';

import {
  Copy,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Hash,
  Zap,
  BarChart3,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import {
  generateUuidV1,
  generateUuidV4,
  generateUuidV5,
  generateMultipleUuids,
  validateUuid,
  formatUuid,
  getUuidStatistics,
  UuidVersion,
} from '../utils/uuid';

export default function UuidGenerator() {
  const [singleUuid, setSingleUuid] = useState('');
  const [multipleUuids, setMultipleUuids] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<UuidVersion>('v4');
  const [count, setCount] = useState(5);
  const [nameInput, setNameInput] = useState('');
  const [namespaceInput, setNamespaceInput] = useState('6ba7b810-9dad-11d1-80b4-00c04fd430c8');
  const [validateInput, setValidateInput] = useState('');
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateUuid> | null>(
    null
  );
  const [format, setFormat] = useState<
    'uppercase' | 'lowercase' | 'brackets' | 'braces' | 'parentheses'
  >('lowercase');

  useEffect(() => {
    generateSingleUuid();
  }, [selectedVersion, nameInput, namespaceInput]);

  useEffect(() => {
    if (validateInput.trim()) {
      const result = validateUuid(validateInput.trim());
      setValidationResult(result);
    } else {
      setValidationResult(null);
    }
  }, [validateInput]);

  const generateSingleUuid = () => {
    let newUuid = '';

    switch (selectedVersion) {
      case 'v1':
        newUuid = generateUuidV1();
        break;
      case 'v4':
        newUuid = generateUuidV4();
        break;
      case 'v5':
        newUuid = generateUuidV5(nameInput || 'default', namespaceInput);
        break;
    }

    setSingleUuid(formatUuid(newUuid, format));
  };

  const generateBulkUuids = () => {
    const uuids = generateMultipleUuids(count, selectedVersion);
    const formattedUuids = uuids.map((uuid) => formatUuid(uuid, format));
    setMultipleUuids(formattedUuids);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const handleCopyAll = async () => {
    const allUuids = multipleUuids.join('\n');
    await navigator.clipboard.writeText(allUuids);
  };

  const handleDownload = () => {
    if (multipleUuids.length === 0) {return;}

    const content = multipleUuids.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${selectedVersion}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const statistics = multipleUuids.length > 0 ? getUuidStatistics(multipleUuids) : null;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            生成
          </TabsTrigger>
          <TabsTrigger value="validate" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            検証
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            一括生成
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Single UUID Generation */}
          <Card>
            <CardHeader>
              <CardTitle>UUID生成</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="version">UUIDバージョン</Label>
                  <Select
                    value={selectedVersion}
                    onValueChange={(value) => setSelectedVersion(value as UuidVersion)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v1">Version 1 (時刻ベース)</SelectItem>
                      <SelectItem value="v4">Version 4 (ランダム)</SelectItem>
                      <SelectItem value="v5">Version 5 (名前ベース SHA-1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="format">フォーマット</Label>
                  <Select value={format} onValueChange={(value) => setFormat(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lowercase">小文字</SelectItem>
                      <SelectItem value="uppercase">大文字</SelectItem>
                      <SelectItem value="brackets">[括弧]</SelectItem>
                      <SelectItem value="braces">{'{波括弧}'}</SelectItem>
                      <SelectItem value="parentheses">(丸括弧)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedVersion === 'v5' && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">名前</Label>
                    <Input
                      id="name"
                      placeholder="UUID生成用の名前を入力"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="namespace">名前空間UUID</Label>
                    <Input
                      id="namespace"
                      placeholder="名前空間UUID"
                      value={namespaceInput}
                      onChange={(e) => setNamespaceInput(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>生成されたUUID</Label>
                  <Button variant="outline" size="sm" onClick={generateSingleUuid}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    再生成
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Input value={singleUuid} readOnly className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(singleUuid)}
                    disabled={!singleUuid}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validate" className="space-y-6">
          {/* UUID Validation */}
          <Card>
            <CardHeader>
              <CardTitle>UUID検証</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="validate">検証するUUID</Label>
                <Input
                  id="validate"
                  placeholder="UUIDを入力してください"
                  value={validateInput}
                  onChange={(e) => setValidateInput(e.target.value)}
                  className="font-mono"
                />
              </div>

              {validationResult && (
                <div className="space-y-4">
                  <Alert
                    className={
                      validationResult.isValid
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }
                  >
                    {validationResult.isValid ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription
                      className={validationResult.isValid ? 'text-green-800' : 'text-red-800'}
                    >
                      {validationResult.isValid ? '有効なUUIDです' : '無効なUUIDです'}
                    </AlertDescription>
                  </Alert>

                  {validationResult.isValid && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{validationResult.version}</Badge>
                          <span className="text-sm text-gray-600">バージョン</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{validationResult.variant}</Badge>
                          <span className="text-sm text-gray-600">バリアント</span>
                        </div>
                      </div>

                      {validationResult.timestamp && (
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">タイムスタンプ:</span>
                            <div className="text-sm text-gray-600">
                              {validationResult.timestamp}
                            </div>
                          </div>
                          {validationResult.node && (
                            <div>
                              <span className="text-sm font-medium">ノード:</span>
                              <div className="font-mono text-sm text-gray-600">
                                {validationResult.node}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          {/* Bulk Generation */}
          <Card>
            <CardHeader>
              <CardTitle>一括UUID生成</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="count">生成数</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(e) =>
                      setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="bulk-version">バージョン</Label>
                  <Select
                    value={selectedVersion}
                    onValueChange={(value) => setSelectedVersion(value as UuidVersion)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v1">Version 1</SelectItem>
                      <SelectItem value="v4">Version 4</SelectItem>
                      <SelectItem value="v5">Version 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={generateBulkUuids} className="w-full">
                    <Hash className="mr-2 h-4 w-4" />
                    生成
                  </Button>
                </div>
              </div>

              {multipleUuids.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>生成されたUUID ({multipleUuids.length}個)</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopyAll}>
                        <Copy className="mr-2 h-4 w-4" />
                        全てコピー
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        ダウンロード
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    value={multipleUuids.join('\n')}
                    readOnly
                    className="h-64 font-mono text-sm"
                  />

                  {statistics && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          統計情報
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {statistics.total}
                            </div>
                            <div className="text-sm text-gray-600">総数</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {statistics.valid}
                            </div>
                            <div className="text-sm text-gray-600">有効</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                              {statistics.total - statistics.valid}
                            </div>
                            <div className="text-sm text-gray-600">無効</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {Object.keys(statistics.versions).length}
                            </div>
                            <div className="text-sm text-gray-600">バージョン数</div>
                          </div>
                        </div>

                        {Object.keys(statistics.versions).length > 0 && (
                          <div className="mt-4">
                            <h4 className="mb-2 font-medium">バージョン別内訳</h4>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(statistics.versions).map(([version, count]) => (
                                <Badge key={version} variant="secondary">
                                  {version}: {count}個
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
