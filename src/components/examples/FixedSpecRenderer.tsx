"use client";
import { useState, useEffect } from "react";
import api from "../../lib/api";
import { t, Spec, SpecItem } from "../../lib/utils/localization";

export default function FixedSpecRenderer() {
  const [spec, setSpec] = useState<Spec | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleCreateAndFetch = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Create spec with normalized data
      const payload = {
        title: { ar: "مواصفات الخدمة", en: "Service Spec" },
        name: "Payment Service",
        items: [
          { label: { ar: "الخطة الأساسية", en: "Basic Plan" }, price: 100 },
          { label: "Premium Plan", value: "Advanced features", price: 200 }
        ],
        meta: { category: "web-services" }
      };

      const createRes = await api.post('/specs/client-1756592974974', payload);
      console.log('Created:', createRes.data);

      // 2. Fetch the same spec
      const fetchRes = await api.get('/specs/client-1756592974974');
      
      // ✅ Store only response.data, not the whole response
      setSpec(fetchRes.data.spec);

    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 border rounded-lg">
      <h3 className="font-bold text-lg">Fixed Spec Renderer</h3>
      
      <button 
        onClick={handleCreateAndFetch}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Create & Fetch Spec'}
      </button>

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded text-red-700">
          Error: {error}
        </div>
      )}

      {spec && (
        <div className="space-y-4 p-4 bg-gray-50 rounded">
          {/* ✅ Safe rendering with t() function */}
          <h4 className="font-semibold">
            Title: {t(spec.title)}
          </h4>
          
          {spec.name && (
            <p>Name: {t(spec.name)}</p>
          )}

          {spec.items && spec.items.length > 0 && (
            <div>
              <h5 className="font-medium mb-2">Items:</h5>
              <ul className="space-y-2">
                {spec.items.map((item: SpecItem, i: number) => (
                  <li key={i} className="flex justify-between items-center p-2 bg-white rounded border">
                    <span>
                      {t(item.label)}
                      {item.value ? `: ${t(item.value)}` : ''}
                    </span>
                    {item.price && (
                      <span className="font-medium text-green-600">
                        ${item.price}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-4">
            <strong>Raw Data:</strong>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(spec, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
