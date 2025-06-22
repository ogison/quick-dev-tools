interface ErrorDisplayProps {
  error: string;
  className?: string;
}

export default function ErrorDisplay({ error, className = '' }: ErrorDisplayProps) {
  if (!error) {
    return null;
  }

  return (
    <div className={`rounded border border-red-400 bg-red-100 p-3 text-red-700 ${className}`}>
      <strong>エラー:</strong> {error}
    </div>
  );
}
