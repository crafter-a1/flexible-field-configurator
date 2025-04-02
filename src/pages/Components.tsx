
import { MainLayout } from '@/components/layout/MainLayout';

export default function Components() {
  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6">Components</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500">Component management interface will be implemented here.</p>
        </div>
      </div>
    </MainLayout>
  );
}
