import axios from "axios";

// Use relative URLs in development to leverage Vite proxy, full URLs in production
const BASE_URL = 
  typeof window !== "undefined" && window.location.hostname === "localhost"
  ? "" // Use relative URLs in development to avoid CORS issues
  : (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE_URL) ||
    "https://backend-marketing-production-67fd.up.railway.app";

export const api = axios.create({ baseURL: BASE_URL, timeout: 20000 });

export async function fetchJson(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const HEALTH_PATH = "/health";

// Legacy compatibility
export interface ApiResponse {
  ok: boolean;
  slug?: string;
  error?: string;
}

export async function saveSpec(slug: string, specData: Record<string, unknown>): Promise<ApiResponse> {
  try {
    // Check if support editor is disabled and exclude support from payload
    const shouldExcludeSupport = import.meta.env.VITE_FEATURE_SUPPORT_EDITOR !== 'true';
    const payload = { ...specData };
    const extraHeaders: Record<string, string> = {};
    
    if (shouldExcludeSupport) {
      delete payload.support;
      extraHeaders['X-Preserve-Support'] = '1';
    }
    
    const response = await api.post(`/api/specs/${slug}`, payload, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...extraHeaders
      }
    });

    return {
      ok: response.data.ok || true,
      slug: response.data.slug || slug
    };
  } catch (error) {
    console.error('Error saving spec:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to save specification'
    };
  }
}

export async function getSpec(slug: string): Promise<unknown> {
  try {
    const response = await api.get(`/api/specs/${slug}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching spec:', error);
    return null;
  }
}
