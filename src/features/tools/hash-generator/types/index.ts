export interface HashResult {
  md5: string;
  sha1: string;
  sha256: string;
}

export type HashType = 'md5' | 'sha1' | 'sha256';

export interface HashOptions {
  uppercase?: boolean;
  encoding?: 'hex' | 'base64';
}