'use client';

import { Copy, Download, Image, Type, Shapes, RotateCcw } from 'lucide-react';
import React, { useState, useRef } from 'react';

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
  generateTextArt,
  generateBorder,
  generatePattern,
  imageToAscii,
  getFontList,
  getPatternList,
  AsciiOptions,
  DEFAULT_ASCII_OPTIONS,
} from '../utils/ascii';

export default function AsciiGenerator() {
  const [textInput, setTextInput] = useState('HELLO');
  const [asciiOutput, setAsciiOutput] = useState('');
  const [options, setOptions] = useState<AsciiOptions>(DEFAULT_ASCII_OPTIONS);
  const [activeTab, setActiveTab] = useState('text');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [patternType, setPatternType] = useState<'box' | 'diamond' | 'triangle'>('box');
  const [patternSize, setPatternSize] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (activeTab === 'text' && textInput) {
      generateTextAscii();
    } else if (activeTab === 'pattern') {
      generatePatternAscii();
    }
  }, [textInput, options, activeTab, patternType, patternSize]);

  const generateTextAscii = () => {
    try {
      const art = generateTextArt(textInput, options);
      const bordered = generateBorder(art, 'single');
      setAsciiOutput(bordered);
    } catch {
      setAsciiOutput('Error generating ASCII art');
    }
  };

  const generatePatternAscii = () => {
    try {
      const pattern = generatePattern(patternType, patternSize);
      setAsciiOutput(pattern);
    } catch {
      setAsciiOutput('Error generating pattern');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      processImage(file);
    }
  };

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const ascii = imageToAscii(imageData, options.width);
        setAsciiOutput(ascii);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = async () => {
    if (asciiOutput) {
      await navigator.clipboard.writeText(asciiOutput);
    }
  };

  const handleDownload = () => {
    if (!asciiOutput) {
      return;
    }

    const blob = new Blob([asciiOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-art-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setTextInput('HELLO');
    setOptions(DEFAULT_ASCII_OPTIONS);
    setPatternSize(10);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sampleTexts = ['HELLO', 'ASCII', 'WORLD', '123', 'DEMO'];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            テキスト
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            画像
          </TabsTrigger>
          <TabsTrigger value="pattern" className="flex items-center gap-2">
            <Shapes className="h-4 w-4" />
            パターン
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>テキスト入力</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text">テキスト</Label>
                <Input
                  id="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="ASCII アートに変換するテキストを入力"
                  className="text-lg"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="font">フォント</Label>
                  <Select
                    value={options.font}
                    onValueChange={(value) => setOptions({ ...options, font: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getFontList().map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="style">スタイル</Label>
                  <Select
                    value={options.style}
                    onValueChange={(value) => setOptions({ ...options, style: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">シンプル</SelectItem>
                      <SelectItem value="block">ブロック</SelectItem>
                      <SelectItem value="shadow">シャドウ</SelectItem>
                      <SelectItem value="double">ダブル</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">サンプルテキスト</Label>
                <div className="flex flex-wrap gap-2">
                  {sampleTexts.map((sample) => (
                    <Button
                      key={sample}
                      variant="outline"
                      size="sm"
                      onClick={() => setTextInput(sample)}
                    >
                      {sample}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    リセット
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>画像アップロード</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image">画像ファイル</Label>
                <Input
                  ref={fileInputRef}
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <div>
                <Label htmlFor="width">ASCII幅</Label>
                <Input
                  id="width"
                  type="number"
                  min="20"
                  max="200"
                  value={options.width}
                  onChange={(e) =>
                    setOptions({ ...options, width: parseInt(e.target.value) || 80 })
                  }
                />
              </div>

              {imageFile && (
                <div className="text-sm text-green-600">アップロード済み: {imageFile.name}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pattern" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>パターン生成</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="pattern">パターンタイプ</Label>
                  <Select
                    value={patternType}
                    onValueChange={(value) => setPatternType(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getPatternList().map((pattern) => (
                        <SelectItem key={pattern.value} value={pattern.value}>
                          {pattern.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">サイズ</Label>
                  <Input
                    id="size"
                    type="number"
                    min="3"
                    max="50"
                    value={patternSize}
                    onChange={(e) => setPatternSize(parseInt(e.target.value) || 10)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Output */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            ASCII アート出力
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!asciiOutput}>
                <Copy className="mr-2 h-4 w-4" />
                コピー
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={!asciiOutput}>
                <Download className="mr-2 h-4 w-4" />
                ダウンロード
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={asciiOutput}
            readOnly
            className="h-96 resize-none font-mono text-xs"
            placeholder="ASCII アートがここに表示されます"
          />
        </CardContent>
      </Card>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
