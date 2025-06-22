import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-opacity-50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-vertical",
  {
    variants: {
      variant: {
        default: "",
        error: "border-destructive focus-visible:border-destructive focus-visible:ring-destructive focus-visible:ring-opacity-50",
        success: "border-success focus-visible:border-success focus-visible:ring-success focus-visible:ring-opacity-50",
        warning: "border-warning focus-visible:border-warning focus-visible:ring-warning focus-visible:ring-opacity-50",
      },
      size: {
        default: "min-h-16",
        sm: "min-h-12 px-2 py-1 text-sm",
        lg: "min-h-24 px-4 py-3",
        xl: "min-h-32 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, label, description, error, success, id, ...props }, ref) => {
    const textareaId = id || React.useId();
    const descriptionId = description ? `${textareaId}-description` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;
    const successId = success ? `${textareaId}-success` : undefined;

    const finalVariant = error ? "error" : success ? "success" : variant;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          data-slot="textarea"
          className={cn(textareaVariants({ variant: finalVariant, size, className }))}
          ref={ref}
          aria-describedby={cn(descriptionId, errorId, successId)}
          aria-invalid={error ? "true" : undefined}
          {...props}
        />
        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p id={successId} className="text-sm text-success">
            {success}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
