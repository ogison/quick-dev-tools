'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HttpRequest, HttpResponse, HttpMethod, BodyType, AuthType } from '../types';
import { sendHttpRequest, generateCurlCommand, formatResponseTime, formatResponseSize, isValidUrl, isValidJson } from '../utils/http-composer';

export default function HttpComposer() {
  const [request, setRequest] = useState<HttpRequest>({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Engineer-Tools HTTP Composer'
    },
    body: '',
    bodyType: 'json',
    auth: { type: 'none' }
  });
  
  const [response, setResponse] = useState<HttpResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'headers' | 'body' | 'auth'>('headers');
  const [responseTab, setResponseTab] = useState<'body' | 'headers' | 'curl'>('body');

  const handleSend = async () => {
    if (!isValidUrl(request.url)) {
      setError('Invalid URL');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await sendHttpRequest(request);
      setResponse(result);
    } catch (err: any) {
      setError(err.statusText || 'Request failed');
      setResponse(err);
    } finally {
      setLoading(false);
    }
  };

  const updateHeader = (key: string, value: string, oldKey?: string) => {
    const newHeaders = { ...request.headers };
    if (oldKey && oldKey !== key) {
      delete newHeaders[oldKey];
    }
    if (key && value) {
      newHeaders[key] = value;
    } else if (key) {
      delete newHeaders[key];
    }
    setRequest({ ...request, headers: newHeaders });
  };

  const addHeader = () => {
    setRequest({
      ...request,
      headers: { ...request.headers, '': '' }
    });
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...request.headers };
    delete newHeaders[key];
    setRequest({ ...request, headers: newHeaders });
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-yellow-600';
    if (status >= 400) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatJsonResponse = (text: string) => {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">HTTP Request Composer</h1>
      
      <div className="space-y-6">
        {/* Request URL */}
        <Card>
          <CardHeader>
            <CardTitle>Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <select
                value={request.method}
                onChange={(e) => setRequest({ ...request, method: e.target.value as HttpMethod })}
                className="px-3 py-2 border rounded-md min-w-[120px]"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
                <option value="HEAD">HEAD</option>
                <option value="OPTIONS">OPTIONS</option>
              </select>
              <input
                type="text"
                value={request.url}
                onChange={(e) => setRequest({ ...request, url: e.target.value })}
                placeholder="Enter URL"
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button onClick={handleSend} disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </div>

            {/* Tabs */}
            <div className="border-b mb-4">
              <nav className="flex space-x-4">
                {['headers', 'body', 'auth'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as typeof activeTab)}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Headers Tab */}
            {activeTab === 'headers' && (
              <div className="space-y-2">
                {Object.entries(request.headers).map(([key, value], index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => updateHeader(e.target.value, value, key)}
                      placeholder="Header key"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateHeader(key, e.target.value)}
                      placeholder="Header value"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeHeader(key)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addHeader}>
                  Add Header
                </Button>
              </div>
            )}

            {/* Body Tab */}
            {activeTab === 'body' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <select
                    value={request.bodyType}
                    onChange={(e) => setRequest({ ...request, bodyType: e.target.value as BodyType })}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="none">None</option>
                    <option value="json">JSON</option>
                    <option value="form">Form Data</option>
                    <option value="raw">Raw</option>
                  </select>
                </div>
                {request.bodyType !== 'none' && (
                  <textarea
                    value={request.body}
                    onChange={(e) => setRequest({ ...request, body: e.target.value })}
                    placeholder={
                      request.bodyType === 'json'
                        ? '{\n  "key": "value"\n}'
                        : 'Request body'
                    }
                    className="w-full h-40 px-3 py-2 border rounded-md font-mono text-sm"
                  />
                )}
              </div>
            )}

            {/* Auth Tab */}
            {activeTab === 'auth' && (
              <div className="space-y-4">
                <select
                  value={request.auth.type}
                  onChange={(e) => setRequest({
                    ...request,
                    auth: { type: e.target.value as AuthType }
                  })}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="none">No Auth</option>
                  <option value="basic">Basic Auth</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="api-key">API Key</option>
                </select>

                {request.auth.type === 'basic' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Username"
                      value={request.auth.basic?.username || ''}
                      onChange={(e) => setRequest({
                        ...request,
                        auth: {
                          ...request.auth,
                          basic: { ...request.auth.basic, username: e.target.value, password: request.auth.basic?.password || '' }
                        }
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={request.auth.basic?.password || ''}
                      onChange={(e) => setRequest({
                        ...request,
                        auth: {
                          ...request.auth,
                          basic: { username: request.auth.basic?.username || '', password: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                )}

                {request.auth.type === 'bearer' && (
                  <input
                    type="text"
                    placeholder="Bearer Token"
                    value={request.auth.bearer || ''}
                    onChange={(e) => setRequest({
                      ...request,
                      auth: { ...request.auth, bearer: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response */}
        {(response || error) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Response
                {response && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-medium ${getStatusColor(response.status)}`}>
                      {response.status} {response.statusText}
                    </span>
                    <span className="text-gray-600">
                      {formatResponseTime(response.time)}
                    </span>
                    <span className="text-gray-600">
                      {formatResponseSize(response.size)}
                    </span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="text-red-600 mb-4">{error}</div>
              )}

              {response && (
                <>
                  {/* Response Tabs */}
                  <div className="border-b mb-4">
                    <nav className="flex space-x-4">
                      {['body', 'headers', 'curl'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setResponseTab(tab as typeof responseTab)}
                          className={`py-2 px-4 border-b-2 font-medium text-sm ${
                            responseTab === tab
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Response Body */}
                  {responseTab === 'body' && (
                    <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm max-h-96">
                      {isValidJson(response.body) ? formatJsonResponse(response.body) : response.body}
                    </pre>
                  )}

                  {/* Response Headers */}
                  {responseTab === 'headers' && (
                    <div className="space-y-2">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key} className="flex gap-2 text-sm">
                          <span className="font-medium w-1/3">{key}:</span>
                          <span className="flex-1">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* cURL Command */}
                  {responseTab === 'curl' && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">cURL Command</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(generateCurlCommand(request))}
                        >
                          Copy
                        </Button>
                      </div>
                      <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm">
                        {generateCurlCommand(request)}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}