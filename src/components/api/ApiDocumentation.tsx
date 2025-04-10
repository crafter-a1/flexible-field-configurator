
import React from 'react';

interface ApiDocumentationProps {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters?: {
    name: string;
    description: string;
    required?: boolean;
    default?: string;
  }[];
  responseExample: any;
}

export const ApiDocumentation: React.FC<ApiDocumentationProps> = ({
  endpoint,
  method = 'GET',
  description,
  parameters = [],
  responseExample,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex items-center mb-4">
        <span className={`
          inline-block px-3 py-1 rounded text-white text-sm font-bold mr-4
          ${method === 'GET' ? 'bg-blue-500' : ''}
          ${method === 'POST' ? 'bg-green-500' : ''}
          ${method === 'PUT' ? 'bg-yellow-500' : ''}
          ${method === 'DELETE' ? 'bg-red-500' : ''}
        `}>
          {method}
        </span>
        <code className="font-mono text-lg">{endpoint}</code>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-700">{description}</p>
      </div>
      
      {parameters.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Parameters</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-2 px-4 border">Name</th>
                <th className="text-left py-2 px-4 border">Description</th>
                <th className="text-left py-2 px-4 border">Required</th>
                <th className="text-left py-2 px-4 border">Default</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((param) => (
                <tr key={param.name}>
                  <td className="py-2 px-4 border font-mono">{param.name}</td>
                  <td className="py-2 px-4 border">{param.description}</td>
                  <td className="py-2 px-4 border">{param.required ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border font-mono">{param.default || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Example Response</h3>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
          <code>{JSON.stringify(responseExample, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};
