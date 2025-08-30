import { api } from '@/lib/api';

// Interface for the spec data to be sent to the backend
export interface SpecData {
  clientName: string;
  brief: string;
  services: Array<{
    category: string;
    items: string[];
  }>;
  pricing: Array<{
    title: string;
    price: number;
    currency: string;
    features: string[];
  }>;
  contact: {
    email?: string;
    phone?: string;
    website?: string;
  };
  meta: {
    brandColors?: string[];
    logoUrl?: string;
  };
}

// Interface for the response from the backend
export interface SaveSpecResponse {
  success: boolean;
  data?: any;
  error?: string;
  link?: string;
  url?: string;
  id?: string;
}

/**
 * Save a specification to the backend
 * @param data The specification data to save
 * @returns A promise that resolves to the response from the backend
 */
export const saveSpecification = async (data: SpecData): Promise<SaveSpecResponse> => {
  try {
    const response = await api.post('/api/specs', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data,
        link: response.data?.link,
        url: response.data?.url,
        id: response.data?.id
      };
    } else {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error: any) {
    console.error('Error saving specification:', error);
    
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
      const message = error.response?.data?.message || error.message || 'Network error occurred';
      return {
        success: false,
        error: message,
      };
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
};

/**
 * Get a specification by slug
 * @param slug The slug of the specification to get
 * @returns A promise that resolves to the specification data
 */
export const getSpecification = async (slug: string): Promise<any> => {
  try {
    const response = await api.get(`/api/specs/${slug}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching specification:', error);
    throw error;
  }
};