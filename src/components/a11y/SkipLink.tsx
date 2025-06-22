'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'bg-background text-foreground ring-ring absolute top-4 left-4 z-50 -translate-y-16 rounded px-4 py-2 text-sm font-medium shadow-lg ring-2 transition-transform focus:translate-y-0',
        className
      )}
      onFocus={(e) => {
        // Ensure the link is visible when focused
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onBlur={(e) => {
        // Hide the link when not focused
        e.currentTarget.style.transform = 'translateY(-4rem)';
      }}
    >
      {children}
    </a>
  );
}

// Default skip links for common use cases
export function DefaultSkipLinks() {
  return (
    <>
      <SkipLink href="#main-content">メインコンテンツにスキップ</SkipLink>
      <SkipLink href="#navigation" className="left-32">
        ナビゲーションにスキップ
      </SkipLink>
    </>
  );
}
