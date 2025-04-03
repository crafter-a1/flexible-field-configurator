
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function Components() {
  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6">Components</h1>
        <Card className="border-gray-100">
          <CardContent className="p-6">
            <Alert variant="info" className="bg-blue-50 border-blue-100">
              <Info className="h-5 w-5 text-blue-500" />
              <AlertDescription className="text-blue-700">
                Component management interface will be implemented here.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
