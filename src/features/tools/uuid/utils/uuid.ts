export type UuidVersion = 'v1' | 'v4' | 'v5';

export interface UuidInfo {
  uuid: string;
  version: string;
  variant: string;
  timestamp?: string;
  node?: string;
  clockSequence?: number;
  isValid: boolean;
}

export const generateUuidV1 = (): string => {
  // UUID v1 implementation (time-based UUID)
  const timestamp = Date.now();
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);

  // Convert timestamp to UUID timestamp format (100-nanosecond intervals since Oct 15, 1582)
  const uuidTimestamp = (timestamp + 12219292800000) * 10000;
  
  const timeLow = (uuidTimestamp & 0xffffffff).toString(16).padStart(8, '0');
  const timeMid = ((uuidTimestamp >>> 32) & 0xffff).toString(16).padStart(4, '0');
  const timeHiAndVersion = (((uuidTimestamp >>> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0');
  
  const clockSeqHiAndReserved = (randomBytes[0] & 0x3f) | 0x80;
  const clockSeqLow = randomBytes[1];
  
  const node = Array.from(randomBytes.slice(2, 8))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeqHiAndReserved.toString(16).padStart(2, '0')}${clockSeqLow.toString(16).padStart(2, '0')}-${node}`;
};

export const generateUuidV4 = (): string => {
  // UUID v4 implementation (random UUID)
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);

  // Set version (4) and variant bits
  randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40; // Version 4
  randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80; // Variant 10

  const hex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
};

export const generateUuidV5 = (name: string, namespace: string = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'): string => {
  // UUID v5 implementation using SHA-1 (simplified)
  // In a real implementation, you would use a proper SHA-1 hash
  const input = namespace + name;
  const hash = simpleHash(input);
  
  const hex = hash.slice(0, 32);
  
  // Set version (5) bits
  const versionHex = (parseInt(hex.slice(12, 16), 16) & 0x0fff) | 0x5000;
  const variantHex = (parseInt(hex.slice(16, 20), 16) & 0x3fff) | 0x8000;

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${versionHex.toString(16).padStart(4, '0')}-${variantHex.toString(16).padStart(4, '0')}-${hex.slice(20, 32)}`;
};

// Simple hash function for demo purposes - in production, use proper SHA-1
const simpleHash = (input: string): string => {
  let hash = 0;
  const str = input + Date.now().toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to hex and pad to 32 characters
  const hexHash = Math.abs(hash).toString(16);
  return (hexHash + Math.random().toString(16).slice(2)).slice(0, 32).padEnd(32, '0');
};

export const generateMultipleUuids = (count: number, version: UuidVersion = 'v4'): string[] => {
  const uuids: string[] = [];
  
  for (let i = 0; i < count; i++) {
    switch (version) {
      case 'v1':
        uuids.push(generateUuidV1());
        break;
      case 'v4':
        uuids.push(generateUuidV4());
        break;
      case 'v5':
        uuids.push(generateUuidV5(`item-${i}`));
        break;
      default:
        uuids.push(generateUuidV4());
    }
  }
  
  return uuids;
};

export const validateUuid = (uuid: string): UuidInfo => {
  const result: UuidInfo = {
    uuid,
    version: 'unknown',
    variant: 'unknown',
    isValid: false,
  };

  // Remove hyphens and check length
  const cleanUuid = uuid.replace(/-/g, '');
  
  if (cleanUuid.length !== 32) {
    return result;
  }

  // Check if it's valid hex
  if (!/^[0-9a-f]{32}$/i.test(cleanUuid)) {
    return result;
  }

  // Check format with hyphens
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)) {
    return result;
  }

  result.isValid = true;

  // Extract version
  const versionNibble = parseInt(cleanUuid[12], 16);
  result.version = `Version ${versionNibble}`;

  // Extract variant
  const variantNibble = parseInt(cleanUuid[16], 16);
  if ((variantNibble & 0x8) === 0) {
    result.variant = 'NCS backward compatibility';
  } else if ((variantNibble & 0xc) === 0x8) {
    result.variant = 'RFC 4122';
  } else if ((variantNibble & 0xe) === 0xc) {
    result.variant = 'Microsoft backward compatibility';
  } else {
    result.variant = 'Reserved for future use';
  }

  // Extract additional info for v1 UUIDs
  if (versionNibble === 1) {
    const timeLow = parseInt(cleanUuid.slice(0, 8), 16);
    const timeMid = parseInt(cleanUuid.slice(8, 12), 16);
    const timeHi = parseInt(cleanUuid.slice(12, 16), 16) & 0x0fff;
    
    // Reconstruct timestamp (this is approximate)
    const timestamp = (timeHi << 48) | (timeMid << 32) | timeLow;
    const unixTimestamp = (timestamp / 10000) - 12219292800000;
    result.timestamp = new Date(unixTimestamp).toISOString();
    
    result.clockSequence = parseInt(cleanUuid.slice(16, 20), 16) & 0x3fff;
    result.node = cleanUuid.slice(20, 32).match(/.{2}/g)?.join(':') || '';
  }

  return result;
};

export const formatUuid = (uuid: string, format: 'uppercase' | 'lowercase' | 'brackets' | 'braces' | 'parentheses'): string => {
  if (!validateUuid(uuid).isValid) {
    return uuid;
  }

  let formatted = uuid;

  switch (format) {
    case 'uppercase':
      formatted = uuid.toUpperCase();
      break;
    case 'lowercase':
      formatted = uuid.toLowerCase();
      break;
    case 'brackets':
      formatted = `[${uuid}]`;
      break;
    case 'braces':
      formatted = `{${uuid}}`;
      break;
    case 'parentheses':
      formatted = `(${uuid})`;
      break;
  }

  return formatted;
};

export const getUuidStatistics = (uuids: string[]): { total: number; valid: number; versions: { [key: string]: number } } => {
  const stats = {
    total: uuids.length,
    valid: 0,
    versions: {} as { [key: string]: number },
  };

  uuids.forEach(uuid => {
    const info = validateUuid(uuid);
    if (info.isValid) {
      stats.valid++;
      const version = info.version;
      stats.versions[version] = (stats.versions[version] || 0) + 1;
    }
  });

  return stats;
};