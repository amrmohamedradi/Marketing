import axios, { AxiosError } from 'axios';

// Configure axios instance to use proxy (no CORS needed)
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
interface SpecData {
  name: string;
  description: string;
  version: string;
}

interface ApiResponse<T> {
  success: boolean;
  id?: string;
  message?: string;
  data?: T;
}

// API functions
export const specsApi = {
  // POST /api/specs/amr-radi
  async updateSpec(id: string, payload: SpecData): Promise<ApiResponse<SpecData>> {
    try {
      console.log(`Calling POST /api/specs/${id}`, payload);
      
      const response = await api.post<ApiResponse<SpecData>>(`/specs/${id}`, payload);
      
      console.log('Response:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof AxiosError) {
        if (error.response) {
          // Server responded with error status
          console.error('Server Error:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
          });
          throw new Error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        } else if (error.request) {
          // Network error (no response received)
          console.error('Network Error:', error.request);
          throw new Error('Network error: Unable to reach server');
        }
      }
      
      throw new Error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // GET /api/specs/amr-radi
  async getSpec(id: string): Promise<ApiResponse<SpecData>> {
    try {
      console.log(`Calling GET /api/specs/${id}`);
      
      const response = await api.get<ApiResponse<SpecData>>(`/specs/${id}`);
      
      console.log('Response:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error('Server Error:', {
            status: error.response.status,
            data: error.response.data
          });
          throw new Error(`Server error: ${error.response.status}`);
        } else if (error.request) {
          console.error('Network Error - no response received');
          throw new Error('Network error: Unable to reach server');
        }
      }
      
      throw new Error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

// Example usage function (not a React component)
export const exampleUsage = async () => {
  try {
    const payload: SpecData = {
      name: 'Updated Spec',
      description: 'This is an updated specification',
      version: '2.0.0'
    };

    const result = await specsApi.updateSpec('amr-radi', payload);
    
    if (result.success) {
      console.log('Spec updated successfully:', result);
      return result;
    } else {
      throw new Error(result.message || 'Update failed');
    }
  } catch (err) {
    console.error('Update failed:', err);
    throw err;
  }
};
