
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function ComponentsPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Component Library</h2>
      <p className="text-gray-500">Create and manage reusable content components</p>
      
      <Alert variant="info" className="bg-blue-50 border-blue-100">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Component management interface will be implemented here.
        </AlertDescription>
      </Alert>
    </div>
  );
}
