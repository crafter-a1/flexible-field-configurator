
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ComponentsPanel } from '@/components/components/ComponentsPanel';

export default function Components() {
  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6">Components</h1>
        <Card className="border-gray-100">
          <CardContent className="p-6">
            <ComponentsPanel />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
