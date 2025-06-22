interface ToolContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export default function ToolContainer({ 
  title, 
  description, 
  children, 
  className = '',
  maxWidth = 'full'
}: ToolContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-none'
  };

  return (
    <div className={`w-full ${maxWidthClasses[maxWidth]} mx-auto ${className}`}>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          {description}
        </p>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}