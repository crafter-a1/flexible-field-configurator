
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CollectionApiService from '@/services/CollectionApiService';
import { ApiDocumentation } from '@/components/api/ApiDocumentation';

/**
 * Component for displaying collection API data and documentation
 */
export default function CollectionApi() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [searchParams] = useSearchParams();
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
        const result = await CollectionApiService.getCollection(collectionId);
        setData(result);
      } catch (err) {
        setError((err as Error).message || 'An error occurred');
        setData({ success: false, error: (err as Error).message });
      }
    };

    fetchData();
  }, [collectionId]);

  // Set response headers for JSON
  useEffect(() => {
    if (data || error) {
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
      <h1 className="text-3xl font-bold mb-8">Collection API</h1>
      
      <ApiDocumentation
        endpoint={`/api/collections/${collectionId || ':collectionId'}`}
        method="GET"
        description="Returns details about a specific collection including its schema and metadata."
        parameters={[
          {
            name: "callback",
            description: "JSONP callback function name for cross-domain requests",
            required: false
          }
        ]}
        responseExample={data || {
          success: true, 
          collection: {
            id: collectionId || "collection-id",
            name: "Blog Posts",
            description: "Collection of blog posts",
            created_at: "2023-01-01T00:00:00Z",
            field_count: 12
          }
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
