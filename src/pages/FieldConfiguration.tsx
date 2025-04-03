
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, ArrowLeft, Save, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldTypeSelector } from '@/components/fields/FieldTypeSelector';
import { FieldConfigPanel } from '@/components/fields/FieldConfigPanel';
import { FieldList } from '@/components/fields/FieldList';
import { FieldValidationPanel } from '@/components/fields/FieldValidationPanel';
import { FieldLayoutPanel } from '@/components/fields/FieldLayoutPanel';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFieldsForCollection, createField } from '@/services/CollectionService';

const fieldTypes = [
  { id: 'text', name: 'Text', description: 'Single line text field' },
  { id: 'textarea', name: 'Text Area', description: 'Multi-line text field' },
  { id: 'number', name: 'Number', description: 'Numeric field with validation' },
  { id: 'date', name: 'Date', description: 'Date picker field' },
  { id: 'boolean', name: 'Boolean', description: 'True/False toggle field' },
  { id: 'select', name: 'Select', description: 'Dropdown selection field' },
  { id: 'relation', name: 'Relation', description: 'Relationship to another collection' },
  { id: 'media', name: 'Media', description: 'Image, video, or document upload' },
  { id: 'json', name: 'JSON', description: 'Structured JSON data field' },
  { id: 'color', name: 'Color', description: 'Color picker field' },
];

export default function FieldConfiguration() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [selectedFieldType, setSelectedFieldType] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('fields');
  
  // Redirect if no collectionId
  useEffect(() => {
    if (!collectionId) {
      navigate('/collections');
    }
  }, [collectionId, navigate]);
  
  // Fetch fields for the selected collection
  const { data: fields = [], isLoading, error } = useQuery({
    queryKey: ['fields', collectionId],
    queryFn: () => getFieldsForCollection(collectionId!),
    enabled: !!collectionId
  });
  
  // Create field mutation
  const createFieldMutation = useMutation({
    mutationFn: (fieldData: any) => createField(collectionId!, fieldData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields', collectionId] });
      // Also invalidate collections to update fields count
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setSelectedFieldType(null);
      setSelectedFieldId(null);
    }
  });

  const selectFieldType = (typeId: string) => {
    setSelectedFieldType(typeId);
    setSelectedFieldId(null);
  };

  const selectField = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    setSelectedFieldType(null);
  };

  const handleSaveField = async (fieldData: any) => {
    if (selectedFieldId) {
      // Update existing field - not implemented yet
      toast({
        title: "Field updated",
        description: `The field "${fieldData.name}" has been updated.`,
      });
    } else {
      // Add new field
      createFieldMutation.mutate({
        ...fieldData,
        type: selectedFieldType
      });
      
      toast({
        title: "Field created",
        description: `The field "${fieldData.name}" has been created.`,
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'fields':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fields List Panel */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  Fields
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      setSelectedFieldId(null);
                      setSelectedFieldType(null);
                      setActiveTab('fields');
                    }}
                    className="h-8 gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Field
                  </Button>
                </CardTitle>
                <CardDescription>
                  All fields defined for this collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center py-4 text-gray-500">Loading fields...</p>
                ) : error ? (
                  <p className="text-center py-4 text-red-500">Error loading fields</p>
                ) : (
                  <FieldList 
                    fields={fields} 
                    onSelectField={selectField} 
                    selectedFieldId={selectedFieldId}
                  />
                )}
              </CardContent>
            </Card>
            
            {/* Field Type Selector or Configuration Panel */}
            <Card className="col-span-1 lg:col-span-2">
              {!selectedFieldType && !selectedFieldId ? (
                <>
                  <CardHeader>
                    <CardTitle className="text-lg">Field Types</CardTitle>
                    <CardDescription>
                      Select a field type to add to your collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FieldTypeSelector 
                      fieldTypes={fieldTypes} 
                      onSelectFieldType={selectFieldType} 
                    />
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedFieldId ? 'Edit Field' : 'New Field'}
                    </CardTitle>
                    <CardDescription>
                      {selectedFieldId 
                        ? 'Modify the field properties' 
                        : `Configure your new ${fieldTypes.find(t => t.id === selectedFieldType)?.name} field`
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FieldConfigPanel
                      fieldType={selectedFieldType || (selectedFieldId ? fields.find(f => f.id === selectedFieldId)?.type : null)}
                      fieldData={selectedFieldId ? fields.find(f => f.id === selectedFieldId) : undefined}
                      onSave={handleSaveField}
                      onCancel={() => {
                        setSelectedFieldId(null);
                        setSelectedFieldType(null);
                      }}
                    />
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        );
      case 'validation':
        return (
          <Card>
            <CardContent className="pt-6">
              <FieldValidationPanel />
            </CardContent>
          </Card>
        );
      case 'layout':
        return (
          <Card>
            <CardContent className="pt-6">
              <FieldLayoutPanel />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/collections')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold mb-1">Field Configuration</h1>
              <p className="text-gray-500">
                {collectionId ? `Configuring fields for "${collectionId}" collection` : 'Configure fields for your collection'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="fields" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-3 mb-8">
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {renderTabContent()}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
