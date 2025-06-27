export interface ImageInfo {
  name: string;
  size: number;
  width: number;
  height: number;
  format: string;
  lastModified: number;
}

export interface CompressionOptions {
  quality: number; // 0-1
  format: 'jpeg' | 'png' | 'webp';
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio: boolean;
  removeMetadata: boolean;
}

export interface CompressionResult {
  originalFile: File;
  compressedBlob: Blob;
  originalInfo: ImageInfo;
  compressedInfo: Omit<ImageInfo, 'name' | 'lastModified'>;
  compressionRatio: number;
  sizeDifference: number;
}

export const DEFAULT_COMPRESSION_OPTIONS: CompressionOptions = {
  quality: 0.85,
  format: 'webp',
  maintainAspectRatio: true,
  removeMetadata: true,
};

export const compressImage = async (
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not supported'));
      return;
    }

    img.onload = () => {
      // Get original info
      const originalInfo: ImageInfo = {
        name: file.name,
        size: file.size,
        width: img.width,
        height: img.height,
        format: file.type,
        lastModified: file.lastModified,
      };

      // Calculate new dimensions
      const { width, height } = calculateDimensions(
        img.width,
        img.height,
        options.maxWidth,
        options.maxHeight,
        options.maintainAspectRatio
      );

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          const compressedInfo = {
            size: blob.size,
            width,
            height,
            format: `image/${options.format}`,
          };

          const result: CompressionResult = {
            originalFile: file,
            compressedBlob: blob,
            originalInfo,
            compressedInfo,
            compressionRatio: ((file.size - blob.size) / file.size) * 100,
            sizeDifference: file.size - blob.size,
          };

          resolve(result);
        },
        `image/${options.format}`,
        options.quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number,
  maxHeight?: number,
  maintainAspectRatio = true
): { width: number; height: number } => {
  let width = originalWidth;
  let height = originalHeight;

  if (!maxWidth && !maxHeight) {
    return { width, height };
  }

  if (maintainAspectRatio) {
    const aspectRatio = originalWidth / originalHeight;

    if (maxWidth && maxHeight) {
      if (width > maxWidth || height > maxHeight) {
        if (maxWidth / maxHeight > aspectRatio) {
          width = maxHeight * aspectRatio;
          height = maxHeight;
        } else {
          width = maxWidth;
          height = maxWidth / aspectRatio;
        }
      }
    } else if (maxWidth && width > maxWidth) {
      width = maxWidth;
      height = maxWidth / aspectRatio;
    } else if (maxHeight && height > maxHeight) {
      width = maxHeight * aspectRatio;
      height = maxHeight;
    }
  } else {
    if (maxWidth) {
      width = Math.min(width, maxWidth);
    }
    if (maxHeight) {
      height = Math.min(height, maxHeight);
    }
  }

  return { width: Math.round(width), height: Math.round(height) };
};

export const getImageInfo = async (file: File): Promise<ImageInfo> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');

    img.onload = () => {
      resolve({
        name: file.name,
        size: file.size,
        width: img.width,
        height: img.height,
        format: file.type,
        lastModified: file.lastModified,
      });
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Unsupported file type. Please use JPEG, PNG, WebP, GIF, or BMP.',
    };
  }

  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size is 50MB.',
    };
  }

  return { isValid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateThumbnail = async (file: File, size = 150): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not supported'));
      return;
    }

    img.onload = () => {
      const { width, height } = calculateDimensions(img.width, img.height, size, size, true);

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', 0.8));
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      reject(new Error('Failed to generate thumbnail'));
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  });
};

export const createPreviewUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

export const revokePreviewUrl = (url: string) => {
  URL.revokeObjectURL(url);
};

export const getOptimizationSuggestions = (result: CompressionResult): string[] => {
  const suggestions: string[] = [];
  const { originalInfo, compressionRatio } = result;

  if (compressionRatio < 10) {
    suggestions.push('品質設定を下げることで、さらなる圧縮が可能です');
  }

  if (originalInfo.width > 1920 || originalInfo.height > 1080) {
    suggestions.push('Webサイト用であれば、さらに小さいサイズにリサイズできます');
  }

  if (originalInfo.format.includes('png') && !hasTransparency(result.originalFile)) {
    suggestions.push('透明度が不要な場合、JPEGまたはWebP形式が効率的です');
  }

  if (compressionRatio > 90) {
    suggestions.push('素晴らしい圧縮率です！ファイルサイズが大幅に削減されました');
  }

  return suggestions;
};

// Simplified transparency check (would need more sophisticated implementation for production)
const hasTransparency = (file: File): boolean => {
  return file.type === 'image/png';
};

export const getSupportedFormats = (): Array<{
  value: string;
  label: string;
  description: string;
}> => {
  return [
    {
      value: 'webp',
      label: 'WebP',
      description: '最新の高効率フォーマット（推奨）',
    },
    {
      value: 'jpeg',
      label: 'JPEG',
      description: '写真に最適、広く対応',
    },
    {
      value: 'png',
      label: 'PNG',
      description: '透明度対応、ロスレス',
    },
  ];
};
