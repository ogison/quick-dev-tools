'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatXml, validateXml, xmlToJson, minifyXml, extractXmlInfo, XmlFormatOptions, DEFAULT_XML_OPTIONS } from '../utils/xml';
import { Copy, Download, RotateCcw, CheckCircle2, XCircle, FileText, Database } from 'lucide-react';

export default function XmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify' | 'validate' | 'to-json'>('format');
  const [options, setOptions] = useState<XmlFormatOptions>(DEFAULT_XML_OPTIONS);
  const [validation, setValidation] = useState<{ isValid: boolean; errors: any[] }>({ isValid: true, errors: [] });
  const [xmlInfo, setXmlInfo] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (input.trim()) {
      processXml();
    } else {
      setOutput('');
      setValidation({ isValid: true, errors: [] });
      setXmlInfo(null);
      setError('');
    }
  }, [input, mode, options]);

  const processXml = () => {
    try {
      setError('');
      
      switch (mode) {
        case 'format':
          const formatted = formatXml(input, options);
          setOutput(formatted);
          break;
          
        case 'minify':
          const minified = minifyXml(input);
          setOutput(minified);
          break;
          
        case 'validate':
          const validationResult = validateXml(input);
          setValidation(validationResult);
          setOutput(validationResult.isValid ? 'XML is valid!' : 'XML has errors (see below)');
          break;
          
        case 'to-json':
          const jsonResult = xmlToJson(input);
          setOutput(JSON.stringify(jsonResult, null, 2));
          break;
      }
      
      // Extract XML info for all modes
      const info = extractXmlInfo(input);
      setXmlInfo(info);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    
    const extension = mode === 'to-json' ? 'json' : 'xml';
    const mimeType = mode === 'to-json' ? 'application/json' : 'application/xml';
    
    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `processed.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    setOptions(DEFAULT_XML_OPTIONS);
    setError('');
    setValidation({ isValid: true, errors: [] });
    setXmlInfo(null);
  };

  const loadSample = () => {
    setInput(`<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
<book id="1" category="fiction">
<title>The Great Gatsby</title>
<author>F. Scott Fitzgerald</author>
<price currency="USD">12.99</price>
<description>A classic American novel set in the Jazz Age.</description>
</book>
<book id="2" category="non-fiction">
<title>Sapiens</title>
<author>Yuval Noah Harari</author>
<price currency="USD">16.99</price>
<description>A brief history of humankind.</description>
</book>
</bookstore>`);
  };

  const modeOptions = [
    { value: 'format', label: '整形', description: 'XMLを読みやすく整形' },
    { value: 'minify', label: '圧縮', description: '不要な空白を除去' },
    { value: 'validate', label: '検証', description: 'XML構文をチェック' },
    { value: 'to-json', label: 'JSON変換', description: 'XMLをJSONに変換' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Mode and Options */}
      <Card>
        <CardHeader>
          <CardTitle>処理モード</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {modeOptions.map(option => (
              <Button
                key={option.value}
                variant={mode === option.value ? 'default' : 'outline'}
                onClick={() => setMode(option.value as any)}
                className="h-auto flex-col py-3"
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </Button>
            ))}
          </div>

          {mode === 'format' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="indentSize">インデント</Label>
                <Select value={options.indentSize.toString()} onValueChange={(value) => setOptions({...options, indentSize: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2スペース</SelectItem>
                    <SelectItem value="4">4スペース</SelectItem>
                    <SelectItem value="8">8スペース</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="sortAttributes"
                  checked={options.sortAttributes}
                  onCheckedChange={(checked) => setOptions({...options, sortAttributes: checked})}
                />
                <Label htmlFor="sortAttributes">属性をソート</Label>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="preserveComments"
                  checked={options.preserveComments}
                  onCheckedChange={(checked) => setOptions({...options, preserveComments: checked})}
                />
                <Label htmlFor="preserveComments">コメント保持</Label>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="preserveWhitespace"
                  checked={options.preserveWhitespace}
                  onCheckedChange={(checked) => setOptions({...options, preserveWhitespace: checked})}
                />
                <Label htmlFor="preserveWhitespace">空白保持</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadSample}>
              <FileText className="h-4 w-4 mr-2" />
              サンプル
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              リセット
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>XML入力</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="XMLコンテンツを入力してください..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono text-sm h-96 resize-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              出力結果
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            ) : (
              <Textarea
                value={output}
                readOnly
                className="font-mono text-sm h-96 resize-none"
                placeholder="処理結果がここに表示されます"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Validation Results */}
      {mode === 'validate' && validation.errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              検証エラー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {validation.errors.map((error, index) => (
                <Alert key={index} className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    Line {error.line}, Column {error.column}: {error.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* XML Info */}
      {xmlInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              XML情報
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {xmlInfo.version && (
                <div>
                  <div className="text-sm font-medium">バージョン</div>
                  <div className="text-sm text-gray-600">{xmlInfo.version}</div>
                </div>
              )}
              {xmlInfo.encoding && (
                <div>
                  <div className="text-sm font-medium">エンコーディング</div>
                  <div className="text-sm text-gray-600">{xmlInfo.encoding}</div>
                </div>
              )}
              {xmlInfo.rootElement && (
                <div>
                  <div className="text-sm font-medium">ルート要素</div>
                  <div className="text-sm text-gray-600">{xmlInfo.rootElement}</div>
                </div>
              )}
              <div>
                <div className="text-sm font-medium">要素数</div>
                <div className="text-sm text-gray-600">{xmlInfo.elementCount}</div>
              </div>
              <div>
                <div className="text-sm font-medium">属性数</div>
                <div className="text-sm text-gray-600">{xmlInfo.attributeCount}</div>
              </div>
              {xmlInfo.namespaces.length > 0 && (
                <div className="col-span-2">
                  <div className="text-sm font-medium mb-2">名前空間</div>
                  <div className="flex flex-wrap gap-2">
                    {xmlInfo.namespaces.map((ns: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {ns}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {validation.isValid && output && mode === 'validate' && (
        <Card>
          <CardContent className="pt-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                XMLは有効です。構文エラーは見つかりませんでした。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}