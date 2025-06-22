interface ErrorDisplayProps {
  error: string;
  className?: string;
}

export default function ErrorDisplay({ error, className = '' }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className={`p-3 bg-red-100 border border-red-400 text-red-700 rounded ${className}`}>
      <strong>エラー:</strong> {error}
    </div>
  );
}