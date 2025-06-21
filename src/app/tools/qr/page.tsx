import QrGenerator from '@/components/QrGenerator';
import { Card, CardContent } from '@/components/ui/card';

export default function QrPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <QrGenerator />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}