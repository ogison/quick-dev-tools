import * as React from 'react';
import { cn } from '@/lib/utils';

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'span';
    
    if (asChild) {
      return <>{props.children}</>;
    }

    return (
      <span
        ref={ref}
        className={cn(
          'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
          'clip-path-[inset(50%)]', // Modern browsers
          className
        )}
        style={{
          clip: 'rect(0, 0, 0, 0)', // Fallback for older browsers
        }}
        {...props}
      />
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';