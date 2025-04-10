
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Code, Copy, RefreshCw, ExternalLink } from 'lucide-react';
import CollectionApiService from '@/services/CollectionApiService';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import JSONEditorField from '@/components/fields/inputs/JSONEditorField';

export default function CollectionApi() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [searchParams] = useSearchParams();
  const includeAppearance = searchParams.get('appearance') !== 'false';
  const includeValidation = searchParams.get('validation') !== 'false';
  
  const [collectionData, setCollectionData] = useState<any>(null);
  const [collectionMetadata, setCollectionMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    fetchCollectionData();
  }, [collectionId, includeAppearance, includeValidation]);

  const fetchCollectionData = async () => {
    if (!collectionId) {
      setError('Collection ID is required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch collection fields
      const fieldsResult = await CollectionApiService.getCollectionFields(
        collectionId,
        includeAppearance,
        includeValidation
      );

      if (!fieldsResult.success) {
        throw new Error(fieldsResult.error);
      }

      // Fetch collection metadata
      const metadataResult = await CollectionApiService.getCollectionMetadata(collectionId);

      if (!metadataResult.success) {
        throw new Error(metadataResult.error);
      }

      setCollectionData(fieldsResult);
      setCollectionMetadata(metadataResult.collection);
    } catch (err) {
      console.error('Error fetching collection data:', err);
      setError((err as Error).message || 'Failed to fetch collection data');
    } finally {
      setIsLoading(false);
    }
  };

  const getApiUrl = () => {
    // Build the URL for API access
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/collections/${collectionId}/fields`;
  };

  const renderUsageExamples = () => {
    const apiUrl = getApiUrl();
    
    const reactExample = `
import { useState, useEffect } from 'react';

function CollectionForm() {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    // Fetch fields from your API
    fetch('${apiUrl}')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setFields(data.fields);
          
          // Initialize form data
          const initialData = {};
          data.fields.forEach(field => {
            initialData[field.apiId] = '';
          });
          setFormData(initialData);
        }
      });
  }, []);
  
  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Submit to your backend
  };
  
  return (
    <div className="collection-form">
      <h2>Collection Form</h2>
      <form onSubmit={handleSubmit}>
        {fields.map(field => (
          <div key={field.id} className="form-field">
            <label>{field.name}</label>
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              placeholder={field.placeholder}
              value={formData[field.apiId] || ''}
              onChange={(e) => handleInputChange(field.apiId, e.target.value)}
              required={field.required}
            />
            {field.helpText && <p className="help-text">{field.helpText}</p>}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
`;

    return (
      <div className="space-y-6">
        <Alert>
          <AlertTitle>API Usage</AlertTitle>
          <AlertDescription>
            Here's how to use this collection's fields in your external application
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">API Endpoint</h3>
          <div className="flex items-center space-x-2">
            <code className="px-2 py-1 bg-gray-100 rounded text-sm flex-1 overflow-x-auto">
              {apiUrl}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(apiUrl);
                toast({
                  title: "Copied to clipboard",
                  description: "API URL has been copied to your clipboard",
                });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">React Example</h3>
          <div className="relative">
            <pre className="p-4 bg-gray-100 rounded text-sm overflow-x-auto">
              {reactExample}
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => {
                navigator.clipboard.writeText(reactExample);
                toast({
                  title: "Copied to clipboard",
                  description: "React example has been copied to your clipboard",
                });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Collection API</h1>
            {collectionMetadata && (
              <p className="text-gray-500">
                {collectionMetadata.title} ({collectionMetadata.api_id})
              </p>
            )}
          </div>
          <Button onClick={fetchCollectionData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="preview">API Preview</TabsTrigger>
            <TabsTrigger value="usage">Usage Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Collection Fields API</CardTitle>
                <CardDescription>
                  Fields exported for {collectionId} collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-x-2">
                        <Button
                          variant={includeAppearance ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('appearance', (!includeAppearance).toString());
                            window.history.pushState({}, '', url);
                            fetchCollectionData();
                          }}
                        >
                          {includeAppearance ? "Hide Appearance" : "Show Appearance"}
                        </Button>
                        <Button
                          variant={includeValidation ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('validation', (!includeValidation).toString());
                            window.history.pushState({}, '', url);
                            fetchCollectionData();
                          }}
                        >
                          {includeValidation ? "Hide Validation" : "Show Validation"}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(collectionData, null, 2));
                          toast({
                            title: "Copied to clipboard",
                            description: "JSON data has been copied to your clipboard",
                          });
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy JSON
                      </Button>
                    </div>
                    <JSONEditorField
                      id="apiPreview"
                      value={collectionData}
                      onChange={() => {}}
                      rows={20}
                      helpText="This is a read-only preview of the API response"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Usage Examples</CardTitle>
                <CardDescription>
                  How to use this collection API in your applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderUsageExamples()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
