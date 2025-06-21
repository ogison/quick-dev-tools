import RegexTester from '@/components/RegexTester';
import { Card, CardContent } from '@/components/ui/card';

export default function RegexPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <RegexTester />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}