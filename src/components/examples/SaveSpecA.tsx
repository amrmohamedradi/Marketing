"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api-with-base";

export default function SaveSpecA() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setResult("");

    try {
      // ✅ Correct: Uses PUT for upsert
      // Final URL: https://your-frontend.vercel.app/api/specs/client-123
      const response = await api.put('/specs/client-123', {
        title: "My Service Spec",
        name: { ar: "خدمة", en: "Service" },
        items: [
          { label: "Basic Plan", price: 100 },
          { label: "Premium Plan", price: 200 }
        ],
        meta: { category: "web-services" }
      });

      setResult(`✅ Saved: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    setLoading(true);
    try {
      // ✅ Correct: Uses '/specs/...' (no '/api' prefix)
      const response = await api.get('/specs/client-123');
      setResult(`📄 Fetched: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-bold">Solution A: With baseURL '/api'</h3>
      <div className="space-x-2">
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Save Spec
        </button>
        <button 
          onClick={handleFetch} 
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Fetch Spec
        </button>
      </div>
      {result && (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {result}
        </pre>
      )}
    </div>
  );
}
