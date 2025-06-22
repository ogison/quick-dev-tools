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
          'absolute -m-px h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap',
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
