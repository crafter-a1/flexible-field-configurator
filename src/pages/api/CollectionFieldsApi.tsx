
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CollectionApiService from '@/services/CollectionApiService';

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

  // Render JSON response
  return (
    <pre style={{ display: callback ? 'none' : 'block' }}>
      {JSON.stringify(data || { success: false, error }, null, 2)}
    </pre>
  );
}
