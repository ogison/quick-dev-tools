import ColorPalette from '@/components/ColorPalette';
import { Card, CardContent } from '@/components/ui/card';

export default function ColorPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <ColorPalette />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}