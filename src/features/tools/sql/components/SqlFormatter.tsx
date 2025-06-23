'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatSql, validateSql, extractTableNames, SqlFormatOptions, DEFAULT_SQL_OPTIONS } from '../utils/sql';
import { Copy, Download, RotateCcw, CheckCircle2, XCircle, Database } from 'lucide-react';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [options, setOptions] = useState<SqlFormatOptions>(DEFAULT_SQL_OPTIONS);
  const [validation, setValidation] = useState<{ isValid: boolean; errors: string[] }>({ isValid: true, errors: [] });
  const [tables, setTables] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (input.trim()) {
      try {
        const result = formatSql(input, options);
        setFormatted(result);
        setError('');
        
        const validationResult = validateSql(input);
        setValidation(validationResult);
        
        const extractedTables = extractTableNames(input);
        setTables(extractedTables);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Formatting error');
        setFormatted('');
      }
    } else {
      setFormatted('');
      setValidation({ isValid: true, errors: [] });
      setTables([]);
      setError('');
    }
  }, [input, options]);

  const handleCopy = async () => {
    if (formatted) {
      await navigator.clipboard.writeText(formatted);
    }
  };

  const handleDownload = () => {
    if (formatted) {
      const blob = new Blob([formatted], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted-query.sql';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleReset = () => {
    setInput('');
    setFormatted('');
    setOptions(DEFAULT_SQL_OPTIONS);
    setError('');
    setValidation({ isValid: true, errors: [] });
    setTables([]);
  };

  const sampleQueries = [
    {
      name: 'Basic SELECT',
      query: 'select users.id, users.name, orders.total from users left join orders on users.id = orders.user_id where users.active = 1 order by users.created_at desc limit 10'
    },
    {
      name: 'Complex JOIN',
      query: 'select u.name, p.title, c.name as category from users u inner join posts p on u.id = p.user_id left join categories c on p.category_id = c.id where u.status = "active" and p.published_at is not null order by p.created_at desc'
    },
    {
      name: 'Aggregate Query',
      query: 'select category_id, count(*) as post_count, avg(view_count) as avg_views from posts where created_at >= "2023-01-01" group by category_id having count(*) > 5 order by post_count desc'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Options Panel */}
      <Card>
        <CardHeader>
          <CardTitle>フォーマットオプション</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dialect">データベース</Label>
              <Select value={options.dialect} onValueChange={(value) => setOptions({...options, dialect: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                  <SelectItem value="mssql">SQL Server</SelectItem>
                  <SelectItem value="oracle">Oracle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="keywordCase">キーワードケース</Label>
              <Select value={options.keywordCase} onValueChange={(value) => setOptions({...options, keywordCase: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upper">大文字</SelectItem>
                  <SelectItem value="lower">小文字</SelectItem>
                  <SelectItem value="camel">キャメルケース</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="indentSize">インデント幅</Label>
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

            <div>
              <Label htmlFor="commaPosition">カンマ位置</Label>
              <Select value={options.commaPosition} onValueChange={(value) => setOptions({...options, commaPosition: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="after">後置</SelectItem>
                  <SelectItem value="before">前置</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Queries */}
      <Card>
        <CardHeader>
          <CardTitle>サンプルクエリ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sample, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInput(sample.query)}
              >
                {sample.name}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              リセット
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle>SQLクエリ入力</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="SQLクエリを入力してください..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono text-sm h-96 resize-none"
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              整形済みSQL
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!formatted}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} disabled={!formatted}>
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
              <pre className="bg-gray-50 p-4 rounded font-mono text-sm h-96 overflow-auto whitespace-pre-wrap">
                {formatted || 'フォーマット済みSQLがここに表示されます'}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analysis */}
      {(validation.errors.length > 0 || tables.length > 0) && (
        <Tabs defaultValue="validation" className="w-full">
          <TabsList>
            <TabsTrigger value="validation">検証結果</TabsTrigger>
            <TabsTrigger value="analysis">解析結果</TabsTrigger>
          </TabsList>

          <TabsContent value="validation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {validation.isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  構文検証
                </CardTitle>
              </CardHeader>
              <CardContent>
                {validation.isValid ? (
                  <div className="text-green-800 bg-green-50 p-4 rounded">
                    構文エラーは検出されませんでした
                  </div>
                ) : (
                  <div className="space-y-2">
                    {validation.errors.map((error, index) => (
                      <Alert key={index} className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">
                          {error}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  クエリ解析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">使用されているテーブル</h4>
                    {tables.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tables.map((table, index) => (
                          <Badge key={index} variant="secondary">
                            {table}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500">テーブルが検出されませんでした</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}