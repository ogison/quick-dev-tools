import PasswordGenerator from '@/components/PasswordGenerator';
import { Card, CardContent } from '@/components/ui/card';

export default function PasswordPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <PasswordGenerator />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}