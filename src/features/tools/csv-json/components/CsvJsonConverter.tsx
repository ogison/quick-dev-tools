'use client';

import {
  Copy,
  Download,
  RotateCcw,
  ArrowRightLeft,
  AlertCircle,
  CheckCircle2,
  FileText,
} from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

import {
  csvToJson,
  jsonToCsv,
  detectDelimiter,
  validateCsv,
  validateJson,
  generateSampleData,
  CsvToJsonOptions,
  JsonToCsvOptions,
  DEFAULT_CSV_OPTIONS,
  DEFAULT_JSON_OPTIONS,
} from '../utils/csv-json';

export default function CsvJsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
  const [csvOptions, setCsvOptions] = useState<CsvToJsonOptions>(DEFAULT_CSV_OPTIONS);
  const [jsonOptions, setJsonOptions] = useState<JsonToCsvOptions>(DEFAULT_JSON_OPTIONS);
  const [validation, setValidation] = useState<{ isValid: boolean; errors: string[] }>({
    isValid: true,
    errors: [],
  });

  useEffect(() => {
    if (input.trim()) {
      handleConvert();
    } else {
      setOutput('');
      setValidation({ isValid: true, errors: [] });
    }
  }, [input, direction, csvOptions, jsonOptions]);

  const handleConvert = async () => {
    try {
      if (direction === 'csv-to-json') {
        const validation = validateCsv(input, csvOptions);
        setValidation(validation);

        if (validation.isValid) {
          const result = csvToJson(input, csvOptions);
          setOutput(JSON.stringify(result, null, 2));
        } else {
          setOutput('');
        }
      } else {
        const validation = validateJson(input);
        setValidation(validation);

        if (validation.isValid) {
          const data = JSON.parse(input);
          const result = jsonToCsv(data, jsonOptions);
          setOutput(result);
        } else {
          setOutput('');
        }
      }
    } catch (error) {
      setValidation({
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Conversion failed'],
      });
      setOutput('');
    }
  };

  const handleSwapDirection = () => {
    const newDirection = direction === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json';
    setDirection(newDirection);

    // Swap input and output if both have content
    if (input.trim() && output.trim()) {
      setInput(output);
      setOutput('');
    }
  };

  const handleDetectDelimiter = () => {
    if (input.trim()) {
      const detected = detectDelimiter(input);
      setCsvOptions((prev) => ({ ...prev, delimiter: detected }));
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

    const extension = direction === 'csv-to-json' ? 'json' : 'csv';
    const mimeType = direction === 'csv-to-json' ? 'application/json' : 'text/csv';

    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-data.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    setCsvOptions(DEFAULT_CSV_OPTIONS);
    setJsonOptions(DEFAULT_JSON_OPTIONS);
    setValidation({ isValid: true, errors: [] });
  };

  const handleLoadSample = () => {
    const sampleData = generateSampleData(direction === 'csv-to-json' ? 'csv' : 'json');
    setInput(sampleData);
  };

  const renderCsvOptions = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="delimiter">区切り文字</Label>
          <Select
            value={csvOptions.delimiter}
            onValueChange={(value) => setCsvOptions({ ...csvOptions, delimiter: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=",">カンマ (,)</SelectItem>
              <SelectItem value=";">セミコロン (;)</SelectItem>
              <SelectItem value="	">タブ</SelectItem>
              <SelectItem value="|">パイプ (|)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center">
          <Button variant="outline" size="sm" onClick={handleDetectDelimiter}>
            自動検出
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Switch
            id="hasHeader"
            checked={csvOptions.hasHeader}
            onCheckedChange={(checked) => setCsvOptions({ ...csvOptions, hasHeader: checked })}
          />
          <Label htmlFor="hasHeader">ヘッダー行あり</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="inferTypes"
            checked={csvOptions.inferTypes}
            onCheckedChange={(checked) => setCsvOptions({ ...csvOptions, inferTypes: checked })}
          />
          <Label htmlFor="inferTypes">データ型を自動推定</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="skipEmptyLines"
            checked={csvOptions.skipEmptyLines}
            onCheckedChange={(checked) => setCsvOptions({ ...csvOptions, skipEmptyLines: checked })}
          />
          <Label htmlFor="skipEmptyLines">空行をスキップ</Label>
        </div>
      </div>
    </div>
  );

  const renderJsonOptions = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="json-delimiter">区切り文字</Label>
          <Select
            value={jsonOptions.delimiter}
            onValueChange={(value) => setJsonOptions({ ...jsonOptions, delimiter: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=",">カンマ (,)</SelectItem>
              <SelectItem value=";">セミコロン (;)</SelectItem>
              <SelectItem value="	">タブ</SelectItem>
              <SelectItem value="|">パイプ (|)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="handleArrays">配列の処理</Label>
          <Select
            value={jsonOptions.handleArrays}
            onValueChange={(value) =>
              setJsonOptions({ ...jsonOptions, handleArrays: value as any })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="join">結合 (;区切り)</SelectItem>
              <SelectItem value="separate">JSON文字列</SelectItem>
              <SelectItem value="index">要素数表示</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Switch
            id="includeHeader"
            checked={jsonOptions.includeHeader}
            onCheckedChange={(checked) =>
              setJsonOptions({ ...jsonOptions, includeHeader: checked })
            }
          />
          <Label htmlFor="includeHeader">ヘッダー行を含める</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="flattenObjects"
            checked={jsonOptions.flattenObjects}
            onCheckedChange={(checked) =>
              setJsonOptions({ ...jsonOptions, flattenObjects: checked })
            }
          />
          <Label htmlFor="flattenObjects">ネストしたオブジェクトを展開</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="nullValue">null値の表現</Label>
        <Select
          value={jsonOptions.nullValue}
          onValueChange={(value) => setJsonOptions({ ...jsonOptions, nullValue: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">空文字</SelectItem>
            <SelectItem value="NULL">NULL</SelectItem>
            <SelectItem value="null">null</SelectItem>
            <SelectItem value="N/A">N/A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Direction and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            変換方向
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleLoadSample}>
                <FileText className="mr-2 h-4 w-4" />
                サンプル
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                リセット
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="rounded bg-gray-100 px-2 py-1 font-mono">
                {direction === 'csv-to-json' ? 'CSV' : 'JSON'}
              </span>
              <ArrowRightLeft className="h-4 w-4" />
              <span className="rounded bg-gray-100 px-2 py-1 font-mono">
                {direction === 'csv-to-json' ? 'JSON' : 'CSV'}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSwapDirection}>
              方向を切り替え
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle>変換オプション</CardTitle>
        </CardHeader>
        <CardContent>
          {direction === 'csv-to-json' ? renderCsvOptions() : renderJsonOptions()}
        </CardContent>
      </Card>

      {/* Input/Output */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>入力 ({direction === 'csv-to-json' ? 'CSV' : 'JSON'})</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={`${direction === 'csv-to-json' ? 'CSV' : 'JSON'}データを入力してください...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-96 resize-none font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              出力 ({direction === 'csv-to-json' ? 'JSON' : 'CSV'})
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
              placeholder="変換結果がここに表示されます"
            />
          </CardContent>
        </Card>
      </div>

      {/* Validation Results */}
      {validation.errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              エラー
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
      {validation.isValid && output && (
        <Card>
          <CardContent className="pt-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                変換が正常に完了しました
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
