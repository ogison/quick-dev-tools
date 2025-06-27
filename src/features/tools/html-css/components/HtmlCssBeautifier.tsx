'use client';

import { Copy, Download, RotateCcw, CheckCircle2, XCircle, FileText, Palette } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import {
  beautifyHtml,
  beautifyCss,
  minifyHtml,
  minifyCss,
  validateHtml,
  validateCss,
  detectLanguage,
  extractInlineStyles,
  BeautifyOptions,
  CssBeautifyOptions,
  DEFAULT_HTML_OPTIONS,
  DEFAULT_CSS_OPTIONS,
} from '../utils/html-css';

export default function HtmlCssBeautifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<'html' | 'css' | 'auto'>('auto');
  const [mode, setMode] = useState<'beautify' | 'minify' | 'validate'>('beautify');
  const [htmlOptions, setHtmlOptions] = useState<BeautifyOptions>(DEFAULT_HTML_OPTIONS);
  const [cssOptions, setCssOptions] = useState<CssBeautifyOptions>(DEFAULT_CSS_OPTIONS);
  const [validation, setValidation] = useState<{ isValid: boolean; errors: string[] }>({
    isValid: true,
    errors: [],
  });
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');

  useEffect(() => {
    if (input.trim()) {
      processCode();
    } else {
      setOutput('');
      setValidation({ isValid: true, errors: [] });
      setDetectedLanguage('');
    }
  }, [input, language, mode, htmlOptions, cssOptions]);

  const processCode = () => {
    try {
      const actualLanguage = language === 'auto' ? detectLanguage(input) : language;
      setDetectedLanguage(actualLanguage);

      switch (mode) {
        case 'beautify':
          if (actualLanguage === 'html') {
            setOutput(beautifyHtml(input, htmlOptions));
          } else if (actualLanguage === 'css') {
            setOutput(beautifyCss(input, cssOptions));
          } else {
            setOutput('Language not detected. Please select HTML or CSS manually.');
          }
          break;

        case 'minify':
          if (actualLanguage === 'html') {
            setOutput(minifyHtml(input));
          } else if (actualLanguage === 'css') {
            setOutput(minifyCss(input));
          } else {
            setOutput('Language not detected. Please select HTML or CSS manually.');
          }
          break;

        case 'validate':
          let validationResult;
          if (actualLanguage === 'html') {
            validationResult = validateHtml(input);
          } else if (actualLanguage === 'css') {
            validationResult = validateCss(input);
          } else {
            validationResult = { isValid: false, errors: ['Language not detected'] };
          }
          setValidation(validationResult);
          setOutput(validationResult.isValid ? 'Code is valid!' : 'Code has errors (see below)');
          break;
      }
    } catch (error) {
      setOutput(
        'Error processing code: ' + (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  };

  const handleDownload = () => {
    if (!output) {
      return;
    }

    const extension = detectedLanguage === 'css' ? 'css' : 'html';
    const mimeType = detectedLanguage === 'css' ? 'text/css' : 'text/html';

    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    setHtmlOptions(DEFAULT_HTML_OPTIONS);
    setCssOptions(DEFAULT_CSS_OPTIONS);
    setValidation({ isValid: true, errors: [] });
  };

  const loadSample = (type: 'html' | 'css') => {
    if (type === 'html') {
      setInput(
        `<!DOCTYPE html><html><head><title>Sample</title><style>.header{background:#333;color:white;padding:10px;}.content{margin:20px;}</style></head><body><div class="header"><h1>Welcome</h1></div><div class="content"><p>This is a sample HTML document.</p><ul><li>Item 1</li><li>Item 2</li></ul></div></body></html>`
      );
      setLanguage('html');
    } else {
      setInput(
        `.navbar{background-color:#333;overflow:hidden;}.navbar a{float:left;display:block;color:#f2f2f2;text-align:center;padding:14px 20px;text-decoration:none;}.navbar a:hover{background-color:#ddd;color:black;}@media screen and (max-width:600px){.navbar a{float:none;display:block;}}`
      );
      setLanguage('css');
    }
  };

  const extractStyles = () => {
    if (detectedLanguage === 'html') {
      const result = extractInlineStyles(input);
      setOutput(
        `<!-- HTML with extracted classes -->\n${result.html}\n\n<!-- Extracted CSS -->\n<style>\n${result.css}\n</style>`
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Mode and Language Selection */}
      <Card>
        <CardHeader>
          <CardTitle>処理設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="language">言語</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">自動検出</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                </SelectContent>
              </Select>
              {detectedLanguage && (
                <div className="mt-1 text-sm text-gray-600">
                  検出: {detectedLanguage.toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="mode">処理モード</Label>
              <Select value={mode} onValueChange={(value) => setMode(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beautify">整形</SelectItem>
                  <SelectItem value="minify">圧縮</SelectItem>
                  <SelectItem value="validate">検証</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      {mode === 'beautify' && (
        <Card>
          <CardHeader>
            <CardTitle>整形オプション</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={detectedLanguage === 'css' ? 'css' : 'html'} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="html">HTML オプション</TabsTrigger>
                <TabsTrigger value="css">CSS オプション</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="indentSize">インデントサイズ</Label>
                    <Select
                      value={htmlOptions.indentSize.toString()}
                      onValueChange={(value) =>
                        setHtmlOptions({ ...htmlOptions, indentSize: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="indentType">インデントタイプ</Label>
                    <Select
                      value={htmlOptions.indentType}
                      onValueChange={(value) =>
                        setHtmlOptions({ ...htmlOptions, indentType: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spaces">スペース</SelectItem>
                        <SelectItem value="tabs">タブ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="maxLineLength">最大行長</Label>
                    <Select
                      value={htmlOptions.maxLineLength.toString()}
                      onValueChange={(value) =>
                        setHtmlOptions({ ...htmlOptions, maxLineLength: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="80">80</SelectItem>
                        <SelectItem value="120">120</SelectItem>
                        <SelectItem value="160">160</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="preserveNewlines"
                      checked={htmlOptions.preserveNewlines}
                      onCheckedChange={(checked) =>
                        setHtmlOptions({ ...htmlOptions, preserveNewlines: checked })
                      }
                    />
                    <Label htmlFor="preserveNewlines">改行を保持</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="endWithNewline"
                      checked={htmlOptions.endWithNewline}
                      onCheckedChange={(checked) =>
                        setHtmlOptions({ ...htmlOptions, endWithNewline: checked })
                      }
                    />
                    <Label htmlFor="endWithNewline">末尾に改行</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="css" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="cssIndentSize">インデントサイズ</Label>
                    <Select
                      value={cssOptions.indentSize.toString()}
                      onValueChange={(value) =>
                        setCssOptions({ ...cssOptions, indentSize: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="cssIndentType">インデントタイプ</Label>
                    <Select
                      value={cssOptions.indentType}
                      onValueChange={(value) =>
                        setCssOptions({ ...cssOptions, indentType: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spaces">スペース</SelectItem>
                        <SelectItem value="tabs">タブ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sortProperties"
                      checked={cssOptions.sortProperties}
                      onCheckedChange={(checked) =>
                        setCssOptions({ ...cssOptions, sortProperties: checked })
                      }
                    />
                    <Label htmlFor="sortProperties">プロパティをソート</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="newlineBetweenRules"
                      checked={cssOptions.newlineBetweenRules}
                      onCheckedChange={(checked) =>
                        setCssOptions({ ...cssOptions, newlineBetweenRules: checked })
                      }
                    />
                    <Label htmlFor="newlineBetweenRules">ルール間に改行</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="preserveComments"
                      checked={cssOptions.preserveComments}
                      onCheckedChange={(checked) =>
                        setCssOptions({ ...cssOptions, preserveComments: checked })
                      }
                    />
                    <Label htmlFor="preserveComments">コメントを保持</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Sample and Tools */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => loadSample('html')}>
              <FileText className="mr-2 h-4 w-4" />
              HTMLサンプル
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadSample('css')}>
              <Palette className="mr-2 h-4 w-4" />
              CSSサンプル
            </Button>
            {detectedLanguage === 'html' && (
              <Button variant="outline" size="sm" onClick={extractStyles}>
                インラインスタイル抽出
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              リセット
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Input/Output */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>入力コード</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="HTML または CSS コードを入力してください..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-96 resize-none font-mono text-sm"
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
            <Textarea
              value={output}
              readOnly
              className="h-96 resize-none font-mono text-sm"
              placeholder="処理結果がここに表示されます"
            />
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
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {mode === 'validate' && validation.isValid && output && (
        <Card>
          <CardContent className="pt-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                コードは有効です。構文エラーは見つかりませんでした。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
