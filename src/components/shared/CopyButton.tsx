'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'green';
  className?: string;
  successMessage?: string;
  children?: React.ReactNode;
}

export default function CopyButton({
  text,
  size = 'md',
  variant = 'default',
  className = '',
  successMessage = 'コピー完了!',
  children,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-sm',
  };

  const variantClasses = {
    default: copied
      ? 'bg-green-100 text-green-700 border border-green-300'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    outline: copied
      ? 'bg-green-100 text-green-700 border border-green-300'
      : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    green: copied
      ? 'bg-green-100 text-green-700 border border-green-300'
      : 'bg-green-600 text-white hover:bg-green-700',
  };

  return (
    <button
      onClick={handleCopy}
      className={`rounded transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children || (copied ? successMessage : 'コピー')}
    </button>
  );
}
