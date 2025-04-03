
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function FieldLayoutPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Form Layout</h2>
      <p className="text-gray-500">Arrange how fields appear in your content forms</p>
      
      <Alert variant="info" className="bg-blue-50 border-blue-100">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertDescription className="text-blue-700">
          The layout editor will allow you to customize how fields are arranged in your content forms. 
          You'll be able to group fields, create columns, and set conditional visibility.
        </AlertDescription>
      </Alert>
      
      <div className="mt-4">
        <p className="text-gray-500">Layout configuration coming soon...</p>
      </div>
    </div>
  );
}
