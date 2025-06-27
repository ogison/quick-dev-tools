'use client';

import { Upload, Download, RotateCcw, Image as ImageIcon, Trash2 } from 'lucide-react';
import React, { useState, useRef } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

import {
  compressImage,
  validateImageFile,
  formatFileSize,
  downloadBlob,
  generateThumbnail,
  createPreviewUrl,
  revokePreviewUrl,
  getOptimizationSuggestions,
  getSupportedFormats,
  CompressionOptions,
  CompressionResult,
  DEFAULT_COMPRESSION_OPTIONS,
} from '../utils/image';
import Image from 'next/image';

interface ProcessedImage {
  id: string;
  file: File;
  result: CompressionResult;
  thumbnail: string;
  previewUrl: string;
}

export default function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [options, setOptions] = useState<CompressionOptions>(DEFAULT_COMPRESSION_OPTIONS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) {
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(selectedFiles).forEach((file) => {
      const validation = validateImageFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      alert('以下のファイルは処理できませんでした:\n' + errors.join('\n'));
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const processImages = async () => {
    if (files.length === 0) {
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    const newProcessedImages: ProcessedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const result = await compressImage(file, options);
        const thumbnail = await generateThumbnail(file);
        const previewUrl = createPreviewUrl(result.compressedBlob);

        newProcessedImages.push({
          id: `${file.name}-${Date.now()}-${i}`,
          file,
          result,
          thumbnail,
          previewUrl,
        });
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
      }

      setProgress(((i + 1) / files.length) * 100);
    }

    setProcessedImages(newProcessedImages);
    setIsProcessing(false);
    setFiles([]);
  };

  const downloadImage = (processedImage: ProcessedImage) => {
    const extension = options.format === 'jpeg' ? 'jpg' : options.format;
    const filename = `${processedImage.file.name.split('.')[0]}_compressed.${extension}`;
    downloadBlob(processedImage.result.compressedBlob, filename);
  };

  const downloadAll = () => {
    processedImages.forEach((processedImage) => {
      downloadImage(processedImage);
    });
  };

  const clearAll = () => {
    processedImages.forEach((processedImage) => {
      revokePreviewUrl(processedImage.previewUrl);
    });
    setProcessedImages([]);
    setFiles([]);
  };

  const supportedFormats = getSupportedFormats();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>画像アップロード</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <div className="space-y-2">
              <div className="text-lg font-medium">画像をドラッグ&ドロップ</div>
              <div className="text-gray-500">または</div>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                ファイルを選択
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              JPEG, PNG, WebP, GIF, BMP対応 (最大50MB/枚)
            </div>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium">選択されたファイル ({files.length})</h4>
                <Button variant="outline" size="sm" onClick={() => setFiles([])}>
                  すべて削除
                </Button>
              </div>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded bg-gray-50 p-2"
                  >
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <Badge variant="outline">{formatFileSize(file.size)}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compression Options */}
      <Card>
        <CardHeader>
          <CardTitle>圧縮設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="format">出力フォーマット</Label>
              <Select
                value={options.format}
                onValueChange={(value) => setOptions({ ...options, format: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div>
                        <div className="font-medium">{format.label}</div>
                        <div className="text-xs text-gray-500">{format.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quality">品質 ({Math.round(options.quality * 100)}%)</Label>
              <div className="mt-2">
                <Slider
                  value={[options.quality]}
                  onValueChange={([value]) => setOptions({ ...options, quality: value })}
                  min={0.1}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="maxWidth">最大幅 (px)</Label>
              <Input
                id="maxWidth"
                type="number"
                placeholder="制限なし"
                value={options.maxWidth || ''}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    maxWidth: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="maxHeight">最大高さ (px)</Label>
              <Input
                id="maxHeight"
                type="number"
                placeholder="制限なし"
                value={options.maxHeight || ''}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    maxHeight: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="maintainAspectRatio"
                checked={options.maintainAspectRatio}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, maintainAspectRatio: checked })
                }
              />
              <Label htmlFor="maintainAspectRatio">アスペクト比を維持</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="removeMetadata"
                checked={options.removeMetadata}
                onCheckedChange={(checked) => setOptions({ ...options, removeMetadata: checked })}
              />
              <Label htmlFor="removeMetadata">メタデータを除去</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={processImages}
              disabled={files.length === 0 || isProcessing}
              className="flex-1"
            >
              {isProcessing ? '処理中...' : `圧縮実行 (${files.length}枚)`}
            </Button>
            <Button variant="outline" onClick={() => setOptions(DEFAULT_COMPRESSION_OPTIONS)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              リセット
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>処理中...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {processedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              圧縮結果 ({processedImages.length}枚)
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadAll}>
                  <Download className="mr-2 h-4 w-4" />
                  すべてダウンロード
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  すべて削除
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {processedImages.map((processedImage) => {
                const suggestions = getOptimizationSuggestions(processedImage.result);

                return (
                  <div key={processedImage.id} className="rounded-lg border p-4">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* Original */}
                      <div>
                        <h4 className="mb-3 font-medium text-gray-700">元の画像</h4>
                        <div className="space-y-3">
                          <div className="aspect-video overflow-hidden rounded bg-gray-100">
                            <Image
                              src={processedImage.thumbnail}
                              alt="Original"
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>ファイル名:</span>
                              <span className="font-mono">
                                {processedImage.result.originalInfo.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>サイズ:</span>
                              <span>
                                {processedImage.result.originalInfo.width} ×{' '}
                                {processedImage.result.originalInfo.height}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>ファイルサイズ:</span>
                              <span>{formatFileSize(processedImage.result.originalInfo.size)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>フォーマット:</span>
                              <span>{processedImage.result.originalInfo.format}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Compressed */}
                      <div>
                        <h4 className="mb-3 font-medium text-green-700">圧縮後</h4>
                        <div className="space-y-3">
                          <div className="aspect-video overflow-hidden rounded bg-gray-100">
                            <img
                              src={processedImage.previewUrl}
                              alt="Compressed"
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>サイズ:</span>
                              <span>
                                {processedImage.result.compressedInfo.width} ×{' '}
                                {processedImage.result.compressedInfo.height}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>ファイルサイズ:</span>
                              <span>
                                {formatFileSize(processedImage.result.compressedInfo.size)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>フォーマット:</span>
                              <span>{processedImage.result.compressedInfo.format}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>圧縮率:</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {processedImage.result.compressionRatio.toFixed(1)}%削減
                              </Badge>
                            </div>
                          </div>
                          <Button onClick={() => downloadImage(processedImage)} className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            ダウンロード
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                      <div className="mt-4">
                        <h5 className="mb-2 font-medium">最適化のヒント</h5>
                        <div className="space-y-1">
                          {suggestions.map((suggestion, index) => (
                            <Alert key={index} className="py-2">
                              <AlertDescription className="text-sm">{suggestion}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
