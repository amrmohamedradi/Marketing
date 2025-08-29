import { SpecData } from '@/components/spec/sections';

const API_BASE_URL = '/api';

export interface ApiResponse {
  ok: boolean;
  slug?: string;
  error?: string;
}

export async function saveSpec(slug: string, specData: SpecData): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/specs/${slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify(specData)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving spec:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to save specification'
    };
  }
}

export async function getSpec(slug: string): Promise<SpecData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/specs/${slug}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error('Specification not found');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching spec:', error);
    return null;
  }
}
