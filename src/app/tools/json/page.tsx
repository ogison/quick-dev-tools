import JsonFormatter from '@/components/JsonFormatter';
import { Card, CardContent } from '@/components/ui/card';

export default function JsonPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <JsonFormatter />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}