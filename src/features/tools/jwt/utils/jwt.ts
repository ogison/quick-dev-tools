export interface JwtHeader {
  alg: string;
  typ: string;
  kid?: string;
}

export interface JwtPayload {
  [key: string]: any;
  exp?: number;
  iat?: number;
  nbf?: number;
  iss?: string;
  sub?: string;
  aud?: string | string[];
  jti?: string;
}

export interface DecodedJwt {
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
  isValid: boolean;
  error?: string;
}

export const decodeJwt = (token: string): DecodedJwt => {
  try {
    const parts = token.split('.');

    if (parts.length !== 3) {
      return {
        header: {} as JwtHeader,
        payload: {},
        signature: '',
        isValid: false,
        error: 'Invalid JWT format. Expected 3 parts separated by dots.',
      };
    }

    const [headerB64, payloadB64, signature] = parts;

    try {
      const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));

      return {
        header,
        payload,
        signature,
        isValid: true,
      };
    } catch (decodeError) {
      return {
        header: {} as JwtHeader,
        payload: {},
        signature: signature || '',
        isValid: false,
        error: 'Failed to decode JWT. Invalid Base64 or JSON format.',
      };
    }
  } catch (error) {
    return {
      header: {} as JwtHeader,
      payload: {},
      signature: '',
      isValid: false,
      error: 'Unexpected error while decoding JWT.',
    };
  }
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
};

export const getTimeUntilExpiry = (exp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const diff = exp - now;

  if (diff < 0) {
    return 'Expired';
  }

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  const parts = [];
  if (days > 0) {parts.push(`${days}日`);}
  if (hours > 0) {parts.push(`${hours}時間`);}
  if (minutes > 0) {parts.push(`${minutes}分`);}
  if (seconds > 0 || parts.length === 0) {parts.push(`${seconds}秒`);}

  return parts.join(' ');
};

export const getClaimDescription = (claim: string): string => {
  const descriptions: { [key: string]: string } = {
    iss: 'Issuer (発行者)',
    sub: 'Subject (主題)',
    aud: 'Audience (対象者)',
    exp: 'Expiration Time (有効期限)',
    nbf: 'Not Before (有効開始時刻)',
    iat: 'Issued At (発行時刻)',
    jti: 'JWT ID (JWT識別子)',
    name: 'Name (名前)',
    email: 'Email (メールアドレス)',
    role: 'Role (役割)',
    scope: 'Scope (スコープ)',
  };

  return descriptions[claim] || claim;
};

export const getAlgorithmInfo = (
  alg: string
): { name: string; type: string; security: 'high' | 'medium' | 'low' | 'none' } => {
  const algorithms: {
    [key: string]: { name: string; type: string; security: 'high' | 'medium' | 'low' | 'none' };
  } = {
    HS256: { name: 'HMAC with SHA-256', type: 'HMAC', security: 'medium' },
    HS384: { name: 'HMAC with SHA-384', type: 'HMAC', security: 'high' },
    HS512: { name: 'HMAC with SHA-512', type: 'HMAC', security: 'high' },
    RS256: { name: 'RSA with SHA-256', type: 'RSA', security: 'high' },
    RS384: { name: 'RSA with SHA-384', type: 'RSA', security: 'high' },
    RS512: { name: 'RSA with SHA-512', type: 'RSA', security: 'high' },
    ES256: { name: 'ECDSA with SHA-256', type: 'ECDSA', security: 'high' },
    ES384: { name: 'ECDSA with SHA-384', type: 'ECDSA', security: 'high' },
    ES512: { name: 'ECDSA with SHA-512', type: 'ECDSA', security: 'high' },
    PS256: { name: 'PSS with SHA-256', type: 'RSA-PSS', security: 'high' },
    PS384: { name: 'PSS with SHA-384', type: 'RSA-PSS', security: 'high' },
    PS512: { name: 'PSS with SHA-512', type: 'RSA-PSS', security: 'high' },
    none: { name: 'No signature', type: 'None', security: 'none' },
  };

  return algorithms[alg] || { name: alg, type: 'Unknown', security: 'low' };
};
