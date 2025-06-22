'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
        success: 'border-success bg-success text-success-foreground',
        warning: 'border-warning bg-warning text-warning-foreground',
        info: 'border-info bg-info text-info-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, title, description, action, onClose, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(toastVariants({ variant }), className)} {...props}>
        <div className="grid gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        {action}
        {onClose && (
          <button
            onClick={onClose}
            className="text-foreground/50 hover:text-foreground absolute top-2 right-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:outline-none"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m11.7816 4.03157c.0824-.08241.0824-.21569 0-.2981-.0824-.08241-.2157-.08241-.2981 0L7.50002 7.70792 3.51909 3.73303c-.08241-.08241-.21569-.08241-.2981 0-.08241.08241-.08241.21569 0 .2981L7.20183 7.99999 3.22093 11.9808c-.08241.0824-.08241.2157 0 .2981.08241.0824.21569.0824.2981 0L7.50002 8.30206l3.98093 3.97504c.0824.0824.2157.0824.2981 0 .0824-.0824.0824-.2157 0-.2981L7.99822 7.99999l3.97998-3.96842z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

// Utility function to show toasts programmatically
export const toast = {
  success: (message: string, options?: { title?: string; duration?: number }) => {
    if (typeof window !== 'undefined') {
      // This would integrate with a toast library like sonner
      console.log('Success toast:', message, options);
    }
  },
  error: (message: string, options?: { title?: string; duration?: number }) => {
    if (typeof window !== 'undefined') {
      console.log('Error toast:', message, options);
    }
  },
  warning: (message: string, options?: { title?: string; duration?: number }) => {
    if (typeof window !== 'undefined') {
      console.log('Warning toast:', message, options);
    }
  },
  info: (message: string, options?: { title?: string; duration?: number }) => {
    if (typeof window !== 'undefined') {
      console.log('Info toast:', message, options);
    }
  },
};

export { Toast, toastVariants };
