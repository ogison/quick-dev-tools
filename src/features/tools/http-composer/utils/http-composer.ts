import { HttpRequest, HttpResponse, AuthConfig } from '../types';

export async function sendHttpRequest(request: HttpRequest): Promise<HttpResponse> {
  const startTime = Date.now();

  try {
    const headers = new Headers();

    // Add custom headers
    Object.entries(request.headers).forEach(([key, value]) => {
      if (key && value) {
        headers.set(key, value);
      }
    });

    // Add authentication
    addAuthHeaders(headers, request.auth);

    // Prepare body
    let body: string | FormData | undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = prepareRequestBody(request.body, request.bodyType, headers);
    }

    const response = await fetch(request.url, {
      method: request.method,
      headers,
      body,
    });

    const responseText = await response.text();
    const endTime = Date.now();

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseText,
      time: endTime - startTime,
      size: new Blob([responseText]).size,
    };
  } catch (error) {
    const endTime = Date.now();
    throw {
      status: 0,
      statusText: error instanceof Error ? error.message : 'Network Error',
      headers: {},
      body: '',
      time: endTime - startTime,
      size: 0,
    };
  }
}

function addAuthHeaders(headers: Headers, auth: AuthConfig): void {
  switch (auth.type) {
    case 'basic':
      if (auth.basic) {
        const credentials = btoa(`${auth.basic.username}:${auth.basic.password}`);
        headers.set('Authorization', `Basic ${credentials}`);
      }
      break;
    case 'bearer':
      if (auth.bearer) {
        headers.set('Authorization', `Bearer ${auth.bearer}`);
      }
      break;
    case 'api-key':
      if (auth.apiKey) {
        if (auth.apiKey.in === 'header') {
          headers.set(auth.apiKey.key, auth.apiKey.value);
        }
        // Query parameters would be handled in URL preparation
      }
      break;
  }
}

function prepareRequestBody(body: string, bodyType: string, headers: Headers): string | FormData {
  switch (bodyType) {
    case 'json':
      headers.set('Content-Type', 'application/json');
      return body;
    case 'form':
      const formData = new FormData();
      try {
        const data = JSON.parse(body);
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
        return formData;
      } catch {
        return body;
      }
    case 'raw':
    default:
      return body;
  }
}

export function generateCurlCommand(request: HttpRequest): string {
  let curl = `curl -X ${request.method}`;

  // Add URL
  curl += ` "${request.url}"`;

  // Add headers
  Object.entries(request.headers).forEach(([key, value]) => {
    if (key && value) {
      curl += ` \\\n  -H "${key}: ${value}"`;
    }
  });

  // Add auth
  switch (request.auth.type) {
    case 'basic':
      if (request.auth.basic) {
        curl += ` \\\n  -u "${request.auth.basic.username}:${request.auth.basic.password}"`;
      }
      break;
    case 'bearer':
      if (request.auth.bearer) {
        curl += ` \\\n  -H "Authorization: Bearer ${request.auth.bearer}"`;
      }
      break;
    case 'api-key':
      if (request.auth.apiKey && request.auth.apiKey.in === 'header') {
        curl += ` \\\n  -H "${request.auth.apiKey.key}: ${request.auth.apiKey.value}"`;
      }
      break;
  }

  // Add body
  if (request.body && request.method !== 'GET' && request.method !== 'HEAD') {
    if (request.bodyType === 'json') {
      curl += ` \\\n  -H "Content-Type: application/json"`;
      curl += ` \\\n  -d '${request.body}'`;
    } else {
      curl += ` \\\n  -d '${request.body}'`;
    }
  }

  return curl;
}

export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatResponseSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes}B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}
