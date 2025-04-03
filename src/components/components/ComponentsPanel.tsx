
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type ComponentType = {
  id: string;
  name: string;
  description: string;
};

const componentTypes: ComponentType[] = [
  { id: "text", name: "Text", description: "Rich text component" },
  { id: "image", name: "Image", description: "Image upload component" },
  { id: "list", name: "List", description: "Ordered or unordered list" },
  { id: "quote", name: "Quote", description: "Blockquote with citation" },
  { id: "code", name: "Code", description: "Code snippet with syntax highlighting" },
  { id: "embed", name: "Embed", description: "Embed external content" },
];

export function ComponentsPanel() {
  const [components, setComponents] = useState<ComponentType[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Component Library</h2>
          <p className="text-gray-500">Create and manage reusable content components</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Component
        </Button>
      </div>

      {components.length === 0 && !isCreating ? (
        <Alert variant="info" className="bg-blue-50 border-blue-100">
          <Info className="h-5 w-5 text-blue-500" />
          <AlertDescription className="text-blue-700">
            No components created yet. Click "Add Component" to create your first reusable component.
          </AlertDescription>
        </Alert>
      ) : isCreating ? (
        <div className="space-y-4">
          <h3 className="font-medium">Select Component Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {componentTypes.map((type) => (
              <Card 
                key={type.id}
                className={cn(
                  "cursor-pointer transition-all hover:border-blue-400 hover:shadow-md",
                )}
                onClick={() => {
                  // In a real implementation, we would open a modal or go to a creation page
                  // For now, just add a dummy component to our list
                  setComponents([...components, type]);
                  setIsCreating(false);
                }}
              >
                <CardContent className="p-4 flex flex-col">
                  <h3 className="font-medium text-base">{type.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-medium">Your Components</h3>
          <div className="space-y-2">
            {components.map((component, index) => (
              <div 
                key={`${component.id}-${index}`}
                className="flex justify-between items-center p-3 rounded-md border border-gray-100 hover:border-gray-200 hover:bg-gray-50"
              >
                <div>
                  <h4 className="font-medium">{component.name}</h4>
                  <p className="text-sm text-gray-500">{component.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
