import axios from "axios";

// Central Axios instance - baseURL already includes '/api'
// DO NOT prefix paths with '/api' when using this instance
export const api = axios.create({
  baseURL: '/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function fetchJson(path: string, init?: RequestInit) {
  const res = await fetch(`/api${path}`, init);
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
