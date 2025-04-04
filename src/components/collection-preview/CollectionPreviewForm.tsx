
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SaveIcon, FileJson, Copy, Code } from 'lucide-react';
import { FieldRenderer } from './FieldRenderer';
import { toast } from '@/hooks/use-toast';
import { adaptFieldsForPreview } from '@/utils/fieldAdapters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import JSONEditorField from '@/components/fields/inputs/JSONEditorField';

interface CollectionPreviewFormProps {
  collectionId: string;
  fields: any[];
  isLoading: boolean;
  error: any;
  onPreviewSave?: (formData: Record<string, any>) => void;
}

export function CollectionPreviewForm({ 
  collectionId, 
  fields, 
  isLoading, 
  error,
  onPreviewSave
}: CollectionPreviewFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldDefinitions, setFieldDefinitions] = useState<any[]>([]);
  const [titleField, setTitleField] = useState<string | null>(null);
  const [jsonViewOpen, setJsonViewOpen] = useState(false);

  useEffect(() => {
    if (fields && fields.length > 0) {
      const adaptedFields = adaptFieldsForPreview(fields);
      setFieldDefinitions(adaptedFields);
      
      const initialData = fields.reduce((acc: Record<string, any>, field: any) => {
        acc[field.api_id] = field.default_value || '';
        return acc;
      }, {});
      setFormData(initialData);
      
      const firstTextField = fields.find((f: any) => f.type === 'text');
      if (firstTextField) {
        setTitleField(firstTextField.api_id);
      }
    }
  }, [fields]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    
    // If onPreviewSave is provided, call it with the form data
    if (onPreviewSave) {
      onPreviewSave(formData);
    } else {
      toast({
        title: "Data saved",
        description: "Your content has been successfully saved.",
      });
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading collection fields...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {(error as Error).message}</div>;
  }

  if (!fields || fields.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No fields found for this collection.</p>
        <p className="text-sm mt-2">Add some fields to the collection to preview content creation.</p>
      </div>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-none">
        <CardContent className="px-0">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-6">
              {fieldDefinitions.map((field) => (
                <FieldRenderer
                  key={field.id}
                  field={field}
                  formData={formData}
                  titleField={titleField}
                  onInputChange={handleInputChange}
                />
              ))}
            </div>
            
            <div className="pt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {Object.keys(formData).length} fields in this collection
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setJsonViewOpen(true)}
                >
                  <Code className="mr-2 h-4 w-4" />
                  View JSON
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
                    toast({
                      title: "Copied to clipboard",
                      description: "JSON data has been copied to your clipboard",
                    });
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy JSON
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Preview
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={jsonViewOpen} onOpenChange={setJsonViewOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Collection JSON Preview</DialogTitle>
            <DialogDescription>
              This is how your data will be structured in the database
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <JSONEditorField
              id="jsonPreview"
              value={formData}
              onChange={() => {}}
              rows={15}
              helpText="This is a read-only preview of your data structure"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
                toast({
                  title: "Copied to clipboard",
                  description: "JSON data has been copied to your clipboard",
                });
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy JSON
            </Button>
            <Button onClick={() => setJsonViewOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
