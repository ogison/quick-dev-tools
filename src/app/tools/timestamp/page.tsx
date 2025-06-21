import TimestampConverter from '@/components/TimestampConverter';
import { Card, CardContent } from '@/components/ui/card';

export default function TimestampPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <TimestampConverter />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}