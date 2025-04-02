
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FieldType {
  id: string;
  name: string;
  description: string;
}

interface FieldTypeSelectorProps {
  fieldTypes: FieldType[];
  onSelectFieldType: (typeId: string) => void;
}

export function FieldTypeSelector({ fieldTypes, onSelectFieldType }: FieldTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fieldTypes.map((fieldType) => (
        <Card 
          key={fieldType.id}
          className={cn(
            "cursor-pointer transition-all hover:border-cms-blue hover:shadow-md",
          )}
          onClick={() => onSelectFieldType(fieldType.id)}
        >
          <CardContent className="p-4 flex flex-col">
            <h3 className="font-medium text-base">{fieldType.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{fieldType.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
