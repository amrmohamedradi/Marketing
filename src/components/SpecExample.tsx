import React, { useState } from 'react';
import { api } from '../lib/api';

interface SpecData {
  name: string;
  description: string;
  version: string;
}

export const SpecExample: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleUpdateSpec = async () => {
    setLoading(true);
    setResult('');

    try {
      const payload: SpecData = {
        name: 'Updated Spec',
        description: 'This is an updated specification',
        version: '2.0.0'
      };

      // ✅ Correct: Uses '/specs/...' (no '/api' prefix)
      // Browser will request: https://my-frontend.vercel.app/api/specs/client-123
      const response = await api.post('/specs/client-123', payload);
      
      setResult(`Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSpec = async () => {
    setLoading(true);
    setResult('');

    try {
      // ✅ Correct: Uses '/specs/...' (no '/api' prefix)
      const response = await api.get('/specs/client-123');
      setResult(`Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">API Test Component</h2>
      
      <div className="space-x-2">
        <button 
          onClick={handleUpdateSpec} 
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'POST /specs/client-123'}
        </button>
        
        <button 
          onClick={handleGetSpec} 
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'GET /specs/client-123'}
        </button>
      </div>

      {result && (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {result}
        </pre>
      )}
      
      <div className="text-sm text-gray-600">
        <p><strong>Note:</strong> These calls use the central api instance from lib/api.ts</p>
        <p><strong>Browser sees:</strong> https://marketing-mauve-ten.vercel.app/api/specs/client-123</p>
        <p><strong>Proxy forwards to:</strong> https://backend-marketing-production-67fd.up.railway.app/api/specs/client-123</p>
      </div>
    </div>
  );
};
