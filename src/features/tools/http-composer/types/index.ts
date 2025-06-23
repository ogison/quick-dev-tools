export interface HttpRequest {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body: string;
  bodyType: BodyType;
  auth: AuthConfig;
}

export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type BodyType = 'json' | 'form' | 'raw' | 'none';

export interface AuthConfig {
  type: AuthType;
  basic?: BasicAuth;
  bearer?: string;
  apiKey?: ApiKeyAuth;
}

export type AuthType = 'none' | 'basic' | 'bearer' | 'api-key';

export interface BasicAuth {
  username: string;
  password: string;
}

export interface ApiKeyAuth {
  key: string;
  value: string;
  in: 'header' | 'query';
}

export interface RequestHistory {
  id: string;
  timestamp: number;
  request: HttpRequest;
  response?: HttpResponse;
  name?: string;
}