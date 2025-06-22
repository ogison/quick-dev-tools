// Hash calculation Web Worker
self.onmessage = async function(e) {
  const { id, type, data } = e.data;

  try {
    switch (type) {
      case 'GENERATE_HASHES':
        const { input } = data;
        
        if (!input || !input.trim()) {
          throw new Error('Input text is required');
        }

        // Simple MD5-like hash implementation
        const simpleMD5 = (str) => {
          let hash = 0;
          for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
          }
          return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 32);
        };

        // ArrayBuffer to hex conversion
        const arrayBufferToHex = (buffer) => {
          return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        };

        // Encode text
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(input);

        // Generate all hashes in parallel
        const [sha1Hash, sha256Hash, sha512Hash] = await Promise.all([
          crypto.subtle.digest('SHA-1', dataBuffer),
          crypto.subtle.digest('SHA-256', dataBuffer),
          crypto.subtle.digest('SHA-512', dataBuffer)
        ]);

        const results = {
          md5: simpleMD5(input),
          sha1: arrayBufferToHex(sha1Hash),
          sha256: arrayBufferToHex(sha256Hash),
          sha512: arrayBufferToHex(sha512Hash)
        };

        self.postMessage({
          id,
          type: 'HASHES_GENERATED',
          result: results
        });
        break;
        
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      id,
      type: 'ERROR',
      error: error.message
    });
  }
};