'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { GraphQLQuery, GraphQLResponse, GraphQLSchema, EndpointConfig } from '../types';
import {
  executeGraphQLQuery,
  fetchSchema,
  formatGraphQLResponse,
  validateGraphQLQuery,
  validateVariables,
  generateExampleQuery,
  generateExampleMutation,
  prettifyQuery,
} from '../utils/graphql';

export default function GraphqlPlayground() {
  const [endpoint, setEndpoint] = useState<EndpointConfig>({
    url: 'https://countries.trevorblades.com/',
    headers: {},
  });

  const [query, setQuery] = useState<GraphQLQuery>({
    query: `query GetCountries {
  countries {
    code
    name
    capital
    currency
  }
}`,
    variables: '{}',
  });

  const [response, setResponse] = useState<GraphQLResponse | null>(null);
  const [schema, setSchema] = useState<GraphQLSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'query' | 'variables' | 'headers'>('query');
  const [responseTab, setResponseTab] = useState<'response' | 'schema' | 'docs'>('response');
  const [queryError, setQueryError] = useState<string | null>(null);
  const [variablesError, setVariablesError] = useState<string | null>(null);

  const handleExecute = async () => {
    const queryValidation = validateGraphQLQuery(query.query);
    if (!queryValidation.isValid) {
      setQueryError(queryValidation.error || 'Invalid query');
      return;
    }

    const variablesValidation = validateVariables(query.variables);
    if (!variablesValidation.isValid) {
      setVariablesError(variablesValidation.error || 'Invalid variables');
      return;
    }

    setQueryError(null);
    setVariablesError(null);
    setLoading(true);

    try {
      const result = await executeGraphQLQuery(endpoint, query);
      setResponse(result);
    } catch {
      setResponse({
        errors: [{ message: 'Failed to execute query' }],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSchema = async () => {
    setSchemaLoading(true);
    try {
      const result = await fetchSchema(endpoint);
      setSchema(result);
    } catch {
      setSchema({
        errors: [{ message: 'Failed to fetch schema' }],
      });
    } finally {
      setSchemaLoading(false);
    }
  };

  const updateHeader = (key: string, value: string, oldKey?: string) => {
    const newHeaders = { ...endpoint.headers };
    if (oldKey && oldKey !== key) {
      delete newHeaders[oldKey];
    }
    if (key && value) {
      newHeaders[key] = value;
    } else if (key) {
      delete newHeaders[key];
    }
    setEndpoint({ ...endpoint, headers: newHeaders });
  };

  const addHeader = () => {
    setEndpoint({
      ...endpoint,
      headers: { ...endpoint.headers, '': '' },
    });
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...endpoint.headers };
    delete newHeaders[key];
    setEndpoint({ ...endpoint, headers: newHeaders });
  };

  const loadExample = (type: 'query' | 'mutation') => {
    const example = type === 'query' ? generateExampleQuery() : generateExampleMutation();
    setQuery(example);
  };

  const prettify = () => {
    setQuery({
      ...query,
      query: prettifyQuery(query.query),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">GraphQL Playground</h1>

      <div className="space-y-6">
        {/* Endpoint Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={endpoint.url}
                onChange={(e) => setEndpoint({ ...endpoint, url: e.target.value })}
                placeholder="GraphQL endpoint URL"
                className="flex-1 rounded-md border px-3 py-2"
              />
              <Button onClick={handleFetchSchema} disabled={schemaLoading}>
                {schemaLoading ? 'Loading...' : 'Fetch Schema'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Query Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Query
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prettify}>
                  Prettify
                </Button>
                <Button variant="outline" size="sm" onClick={() => loadExample('query')}>
                  Example Query
                </Button>
                <Button variant="outline" size="sm" onClick={() => loadExample('mutation')}>
                  Example Mutation
                </Button>
                <Button onClick={handleExecute} disabled={loading}>
                  {loading ? 'Executing...' : 'Execute'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Tabs */}
            <div className="mb-4 border-b">
              <nav className="flex space-x-4">
                {['query', 'variables', 'headers'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as typeof activeTab)}
                    className={`border-b-2 px-4 py-2 text-sm font-medium ${
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

            {/* Query Tab */}
            {activeTab === 'query' && (
              <div>
                <textarea
                  value={query.query}
                  onChange={(e) => setQuery({ ...query, query: e.target.value })}
                  placeholder="Enter your GraphQL query..."
                  className="h-64 w-full rounded-md border px-3 py-2 font-mono text-sm"
                />
                {queryError && <div className="mt-2 text-sm text-red-600">{queryError}</div>}
              </div>
            )}

            {/* Variables Tab */}
            {activeTab === 'variables' && (
              <div>
                <textarea
                  value={query.variables}
                  onChange={(e) => setQuery({ ...query, variables: e.target.value })}
                  placeholder={`{
  "variable": "value"
}`}
                  className="h-64 w-full rounded-md border px-3 py-2 font-mono text-sm"
                />
                {variablesError && (
                  <div className="mt-2 text-sm text-red-600">{variablesError}</div>
                )}
              </div>
            )}

            {/* Headers Tab */}
            {activeTab === 'headers' && (
              <div className="space-y-2">
                {Object.entries(endpoint.headers).map(([key, value], index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => updateHeader(e.target.value, value, key)}
                      placeholder="Header key"
                      className="flex-1 rounded-md border px-3 py-2"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateHeader(key, e.target.value)}
                      placeholder="Header value"
                      className="flex-1 rounded-md border px-3 py-2"
                    />
                    <Button variant="outline" size="sm" onClick={() => removeHeader(key)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addHeader}>
                  Add Header
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response */}
        {(response || schema) && (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Response Tabs */}
              <div className="mb-4 border-b">
                <nav className="flex space-x-4">
                  {['response', 'schema', 'docs'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setResponseTab(tab as typeof responseTab)}
                      className={`border-b-2 px-4 py-2 text-sm font-medium ${
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

              {/* Response Tab */}
              {responseTab === 'response' && response && (
                <div>
                  {response.errors && response.errors.length > 0 && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
                      <h4 className="mb-2 font-medium text-red-800">Errors:</h4>
                      {response.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-700">
                          {error.message}
                        </div>
                      ))}
                    </div>
                  )}
                  <pre className="max-h-96 overflow-auto rounded-md bg-gray-50 p-4 text-sm">
                    {formatGraphQLResponse(response)}
                  </pre>
                </div>
              )}

              {/* Schema Tab */}
              {responseTab === 'schema' && (
                <div>
                  {schema ? (
                    <pre className="max-h-96 overflow-auto rounded-md bg-gray-50 p-4 text-sm">
                      {JSON.stringify(schema, null, 2)}
                    </pre>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      No schema loaded. Click Fetch Schema to load the schema.
                    </div>
                  )}
                </div>
              )}

              {/* Docs Tab */}
              {responseTab === 'docs' && (
                <div>
                  {schema?.data?.__schema ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 font-medium">Query Type</h3>
                        <p className="text-gray-600">{schema.data.__schema.queryType?.name}</p>
                      </div>
                      {schema.data.__schema.mutationType && (
                        <div>
                          <h3 className="mb-2 font-medium">Mutation Type</h3>
                          <p className="text-gray-600">{schema.data.__schema.mutationType.name}</p>
                        </div>
                      )}
                      {schema.data.__schema.subscriptionType && (
                        <div>
                          <h3 className="mb-2 font-medium">Subscription Type</h3>
                          <p className="text-gray-600">
                            {schema.data.__schema.subscriptionType.name}
                          </p>
                        </div>
                      )}
                      <div>
                        <h3 className="mb-2 font-medium">
                          Types ({schema.data.__schema.types.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
                          {schema.data.__schema.types
                            .filter((type) => !type.name.startsWith('__'))
                            .map((type) => (
                              <div key={type.name} className="text-gray-600">
                                {type.name} ({type.kind})
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      No schema documentation available. Fetch the schema first.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
