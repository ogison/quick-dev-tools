import LoremIpsum from '@/components/LoremIpsum';
import { Card, CardContent } from '@/components/ui/card';

export default function LoremPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <LoremIpsum />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}