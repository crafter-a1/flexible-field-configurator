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
  category?: string;
};

const componentTypes: ComponentType[] = [
  { id: "text", name: "Input Text", description: "Basic text input field", category: "Input" },
  { id: "textarea", name: "Input Text Area", description: "Multi-line text input", category: "Input" },
  { id: "password", name: "Password", description: "Secure password input with toggle", category: "Input" },
  { id: "number", name: "Input Number", description: "Numeric input with formatting", category: "Input" },
  { id: "mask", name: "Input Mask", description: "Input with formatting mask", category: "Input" },
  { id: "group", name: "Input Group", description: "Group multiple inputs together", category: "Input" },
  { id: "otp", name: "Input OTP", description: "One-time password input", category: "Input" },
  
  { id: "dropdown", name: "Dropdown Field", description: "Select from a dropdown list", category: "Selection" },
  { id: "multiselect", name: "MultiSelect", description: "Select multiple options", category: "Selection" },
  { id: "selectbutton", name: "Select Button", description: "Button-style option selector", category: "Selection" },
  { id: "listbox", name: "List Box", description: "Scrollable selection list", category: "Selection" },
  { id: "treeselect", name: "Tree Select", description: "Hierarchical selection component", category: "Selection" },
  { id: "mention", name: "Mention Box", description: "Text input with @mentions", category: "Selection" },
  
  { id: "checkbox", name: "Checkbox", description: "Standard checkbox input", category: "Toggle" },
  { id: "tristatecheck", name: "Tri-State Checkbox", description: "Checkbox with three states", category: "Toggle" },
  { id: "multistatecheck", name: "Multi-State Checkbox", description: "Checkbox with multiple states", category: "Toggle" },
  { id: "switch", name: "Input Switch", description: "Toggle switch component", category: "Toggle" },
  { id: "togglebutton", name: "Toggle Button", description: "Button with toggle state", category: "Toggle" },
  
  { id: "slider", name: "Slider", description: "Range selector with draggable handle", category: "Advanced" },
  { id: "calendar", name: "Calendar", description: "Date picker with calendar UI", category: "Advanced" },
  { id: "colorpicker", name: "Color Picker", description: "Visual color selection tool", category: "Advanced" },
  { id: "rating", name: "Rating", description: "Star-based rating selector", category: "Advanced" },
  
  { id: "image", name: "Image", description: "Image upload component", category: "Media" },
  { id: "code", name: "Code", description: "Code snippet with syntax highlighting", category: "Text" },
  { id: "quote", name: "Quote", description: "Blockquote with citation", category: "Text" },
  { id: "list", name: "List", description: "Ordered or unordered list", category: "Text" },
  { id: "embed", name: "Embed", description: "Embed external content", category: "Media" },
];

const groupedComponents = componentTypes.reduce((acc, component) => {
  const category = component.category || "Other";
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(component);
  return acc;
}, {} as Record<string, ComponentType[]>);

const categories = Object.keys(groupedComponents);

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
          
          {categories.map((category) => (
            <div key={category} className="mb-6">
              <h4 className="text-lg font-medium mb-3">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedComponents[category].map((type) => (
                  <Card 
                    key={type.id}
                    className={cn(
                      "cursor-pointer transition-all hover:border-blue-400 hover:shadow-md",
                    )}
                    onClick={() => {
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
            </div>
          ))}
          
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
