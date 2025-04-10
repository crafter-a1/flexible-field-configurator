
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CollectionApiService from '@/services/CollectionApiService';
import { ApiDocumentation } from '@/components/api/ApiDocumentation';

/**
 * Component for displaying collection fields API data and documentation
 */
export default function CollectionFieldsApi() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [searchParams] = useSearchParams();
  const includeAppearance = searchParams.get('appearance') !== 'false';
  const includeValidation = searchParams.get('validation') !== 'false';
  const callback = searchParams.get('callback');
  
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionId) {
      setError('Collection ID is required');
      return;
    }

    const fetchData = async () => {
      try {
        const result = await CollectionApiService.getCollectionFields(
          collectionId,
          includeAppearance,
          includeValidation
        );
        setData(result);
      } catch (err) {
        setError((err as Error).message || 'An error occurred');
        setData({ success: false, error: (err as Error).message });
      }
    };

    fetchData();
  }, [collectionId, includeAppearance, includeValidation]);

  // Set response headers for JSON
  useEffect(() => {
    if (data || error) {
      // This is a client-side solution since we don't have direct access to HTTP headers in React Router
      document.title = 'API Response';
      
      // If JSONP callback is provided
      if (callback && typeof callback === 'string' && /^[a-zA-Z0-9_]+$/.test(callback)) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `${callback}(${JSON.stringify(data || { success: false, error })})`;
        document.body.innerHTML = '';
        document.body.appendChild(script);
      }
    }
  }, [data, error, callback]);

  // If we're rendering as JSONP, don't show the documentation
  if (callback) {
    return (
      <pre style={{ display: 'none' }}>
        {JSON.stringify(data || { success: false, error }, null, 2)}
      </pre>
    );
  }

  // Show documentation and response
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Collection Fields API</h1>
      
      <ApiDocumentation
        endpoint={`/api/collections/${collectionId || ':collectionId'}/fields`}
        method="GET"
        description="Returns all fields for a specific collection with their settings."
        parameters={[
          {
            name: "appearance",
            description: "Include appearance settings in the response",
            required: false,
            default: "true"
          },
          {
            name: "validation",
            description: "Include validation settings in the response",
            required: false,
            default: "true"
          },
          {
            name: "callback",
            description: "JSONP callback function name for cross-domain requests",
            required: false
          }
        ]}
        responseExample={data || {
          success: true, 
          fields: [
            { 
              id: "field1",
              name: "Title", 
              type: "text",
              validation_settings: { required: true, minLength: 3 },
              appearance_settings: { uiVariant: "filled" } 
            }
          ]
        }}
      />
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Response</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
          {JSON.stringify(data || { success: false, error }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
