import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
  ok: boolean;
  slug?: string;
  url?: string;
  error?: any;
}

/**
 * Save a specification to the backend
 * @param specData The specification data to save
 * @returns A promise that resolves to the response from the backend
 */
export const saveSpecification = async (specData: SpecData): Promise<SaveSpecResponse> => {
  try {
    console.log('Saving specification to:', `${API_BASE_URL}/api/specs`);
    console.log('Specification data:', JSON.stringify(specData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/api/specs`, specData);
    console.log('Server response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error in saveSpecification:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server responded with error:', error.response.status, error.response.data);
      return { ok: false, error: `Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}` };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server:', error.request);
      return { ok: false, error: 'No response from server. Please check if the backend is running.' };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      return { ok: false, error: `Request setup error: ${error.message}` };
    }
  }
};

/**
 * Get a specification by slug
 * @param slug The slug of the specification to get
 * @returns A promise that resolves to the specification data
 */
export const getSpecification = async (slug: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/specs/${slug}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching specification:', error);
    throw error;
  }
};