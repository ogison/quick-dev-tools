/**
 * UUID Generator Utilities
 * Supports UUID v1, v4, and Nil UUID generation
 */

/**
 * Generate a UUID v4 (random)
 * Uses crypto.randomUUID() if available, falls back to custom implementation
 */
export function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a UUID v1 (timestamp-based)
 */
export function generateUUIDv1(): string {
  const timestamp = new Date().getTime();
  const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, '0');
  const timeMid = ((timestamp / 0x100000000) & 0xffff).toString(16).padStart(4, '0');
  const timeHi = (((timestamp / 0x1000000000000) & 0x0fff) | 0x1000)
    .toString(16)
    .padStart(4, '0');

  const clockSeq = ((Math.random() * 0x3fff) | 0x8000).toString(16).padStart(4, '0');

  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')
  ).join('');

  return `${timeLow}-${timeMid}-${timeHi}-${clockSeq}-${node}`;
}

/**
 * Generate a Nil UUID (all zeros)
 */
export function generateNilUUID(): string {
  return '00000000-0000-0000-0000-000000000000';
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const nilUuidRegex = /^0{8}-0{4}-0{4}-0{4}-0{12}$/;

  return uuidRegex.test(uuid) || nilUuidRegex.test(uuid);
}

/**
 * Get UUID version
 */
export function getUUIDVersion(uuid: string): number | null {
  if (!isValidUUID(uuid)) {
    return null;
  }

  const versionChar = uuid.charAt(14);
  return parseInt(versionChar, 10);
}

/**
 * Format UUID to different cases
 */
export function formatUUID(uuid: string, format: 'uppercase' | 'lowercase'): string {
  return format === 'uppercase' ? uuid.toUpperCase() : uuid.toLowerCase();
}

/**
 * Remove hyphens from UUID
 */
export function removeHyphens(uuid: string): string {
  return uuid.replace(/-/g, '');
}

/**
 * Add hyphens to UUID
 */
export function addHyphens(uuid: string): string {
  if (uuid.length !== 32) {
    throw new Error('Invalid UUID length. Expected 32 characters without hyphens.');
  }

  return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
}

/**
 * Generate multiple UUIDs
 */
export function generateMultipleUUIDs(
  count: number,
  version: 'v1' | 'v4' | 'nil' = 'v4'
): string[] {
  const generator =
    version === 'v1' ? generateUUIDv1 : version === 'nil' ? generateNilUUID : generateUUIDv4;

  return Array.from({ length: count }, () => generator());
}
