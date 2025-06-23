'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { decodeJwt, formatTimestamp, getTimeUntilExpiry, getClaimDescription, getAlgorithmInfo } from '../utils/jwt';
import { AlertCircle, CheckCircle2, XCircle, Clock, Shield } from 'lucide-react';

export default function JwtDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<ReturnType<typeof decodeJwt> | null>(null);

  useEffect(() => {
    if (input.trim()) {
      const result = decodeJwt(input.trim());
      setDecoded(result);
    } else {
      setDecoded(null);
    }
  }, [input]);

  const renderSecurityBadge = (security: string) => {
    const variants: { [key: string]: string } = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-orange-100 text-orange-800',
      none: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={variants[security] || variants.low}>
        {security === 'high' && 'セキュア'}
        {security === 'medium' && '中程度'}
        {security === 'low' && '低セキュリティ'}
        {security === 'none' && '署名なし'}
      </Badge>
    );
  };

  const renderClaim = (key: string, value: any) => {
    const description = getClaimDescription(key);
    let displayValue = value;

    if (key === 'exp' || key === 'iat' || key === 'nbf') {
      displayValue = (
        <div className="space-y-1">
          <div>{formatTimestamp(value)}</div>
          {key === 'exp' && (
            <div className="text-sm text-gray-500">
              残り時間: {getTimeUntilExpiry(value)}
            </div>
          )}
        </div>
      );
    } else if (typeof value === 'object') {
      displayValue = (
        <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    } else {
      displayValue = String(value);
    }

    return (
      <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b last:border-0">
        <div className="font-mono text-sm">{key}</div>
        <div className="text-sm text-gray-600">{description}</div>
        <div className="text-sm">{displayValue}</div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>JWT入力</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="JWTトークンを貼り付けてください..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="font-mono text-sm h-32"
          />
        </CardContent>
      </Card>

      {decoded && (
        <>
          {decoded.error ? (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {decoded.error}
              </AlertDescription>
            </Alert>
          ) : (
            <Tabs defaultValue="header" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="header">ヘッダー</TabsTrigger>
                <TabsTrigger value="payload">ペイロード</TabsTrigger>
                <TabsTrigger value="signature">署名</TabsTrigger>
              </TabsList>

              <TabsContent value="header" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ヘッダー情報</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {decoded.header.alg && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span className="font-medium">アルゴリズム</span>
                        </div>
                        <div className="pl-6 space-y-2">
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-2 py-1 rounded">
                              {decoded.header.alg}
                            </code>
                            {renderSecurityBadge(getAlgorithmInfo(decoded.header.alg).security)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {getAlgorithmInfo(decoded.header.alg).name}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="pt-4">
                      <h4 className="font-medium mb-2">Raw Header</h4>
                      <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
                        {JSON.stringify(decoded.header, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payload" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ペイロード（クレーム）</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {Object.entries(decoded.payload).map(([key, value]) =>
                        renderClaim(key, value)
                      )}
                    </div>
                    {decoded.payload.exp && (
                      <div className="mt-4">
                        {decoded.payload.exp * 1000 < Date.now() ? (
                          <Alert className="border-red-200 bg-red-50">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                              このトークンは期限切れです
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert className="border-green-200 bg-green-50">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                              トークンは有効です
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="signature" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">署名情報</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">署名値</h4>
                      <code className="block bg-gray-50 p-4 rounded overflow-auto text-sm break-all">
                        {decoded.signature}
                      </code>
                    </div>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        署名の検証には秘密鍵または公開鍵が必要です。
                        このツールは現在、署名の検証機能をサポートしていません。
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}