"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api-without-base";

export default function SaveSpecB() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setResult("");

    try {
      // ✅ Correct: Uses PUT for upsert with full path
      // Final URL: https://your-frontend.vercel.app/api/specs/client-456
      const response = await api.put('/api/specs/client-456', {
        title: "Another Service Spec",
        name: "Payment Service",
        items: [
          { label: "Starter Plan", price: 50 },
          { label: "Business Plan", price: 150 }
        ],
        meta: { category: "payment-services" }
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
      // ✅ Correct: Uses full '/api/specs/...' path
      const response = await api.get('/api/specs/client-456');
      setResult(`📄 Fetched: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-bold">Solution B: Without baseURL</h3>
      <div className="space-x-2">
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
        >
          Save Spec
        </button>
        <button 
          onClick={handleFetch} 
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
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
