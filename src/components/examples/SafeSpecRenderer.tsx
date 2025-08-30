"use client";
import { useState } from "react";
import api from "../../lib/api";
import { t, Localized, SpecItem, Spec } from "../../utils/localization";

export default function SafeSpecRenderer() {
  const [spec, setSpec] = useState<Spec | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleCreateAndFetch = async () => {
    setLoading(true);
    setError("");

    try {
      // Create spec with normalized data
      const payload = {
        title: { ar: "مواصفات الخدمة", en: "Service Specification" },
        name: "Client Service Package",
        items: [
          { 
            label: { ar: "الخطة الأساسية", en: "Basic Plan" }, 
            value: "Standard features",
            price: 100 
          },
          { 
            label: "Premium Plan", 
            value: { ar: "ميزات متقدمة", en: "Advanced features" }, 
            price: 200 
          }
        ],
        meta: { category: "web-services" }
      };

      // ✅ Store only response.data, not whole response
      const createRes = await api.post('/specs/client-1756592974974', payload);
      console.log('Created:', createRes.data);

      const fetchRes = await api.get('/specs/client-1756592974974');
      setSpec(fetchRes.data.spec); // ✅ Extract .data.spec, not full response

    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 border rounded-lg max-w-2xl mx-auto">
      <h3 className="font-bold text-lg">Safe Spec Renderer (No Error #130)</h3>
      
      <button 
        onClick={handleCreateAndFetch}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600"
      >
        {loading ? 'Loading...' : 'Create & Fetch Spec'}
      </button>

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded text-red-700">
          ❌ Error: {error}
        </div>
      )}

      {spec && (
        <div className="space-y-4 p-4 bg-gray-50 rounded">
          {/* ✅ Safe rendering - no objects in JSX */}
          <div>
            <h4 className="font-semibold text-lg">
              {t(spec.title)}
            </h4>
            {spec.name && (
              <p className="text-gray-600">
                Service: {t(spec.name)}
              </p>
            )}
          </div>

          {spec.items && spec.items.length > 0 && (
            <div>
              <h5 className="font-medium mb-3">Service Items:</h5>
              <div className="space-y-2">
                {spec.items.map((item: SpecItem, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white rounded border">
                    <div>
                      <span className="font-medium">
                        {t(item.label)}
                      </span>
                      {item.value && (
                        <span className="text-gray-600 text-sm block">
                          {t(item.value)}
                        </span>
                      )}
                    </div>
                    {item.price && (
                      <span className="font-semibold text-green-600">
                        ${item.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer font-medium">Raw API Response</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(spec, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
