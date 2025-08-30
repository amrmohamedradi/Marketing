import axios, { AxiosError } from 'axios';

// Configure axios instance
const api = axios.create({
  baseURL: '/api', // Uses same-origin if using proxy, or full URL if CORS
  timeout: 10000,
  withCredentials: true, // Only if cookies/sessions are needed
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

// React component example
export const SpecUpdater: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateSpec = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload: SpecData = {
        name: 'Updated Spec',
        description: 'This is an updated specification',
        version: '2.0.0'
      };

      const result = await specsApi.updateSpec('amr-radi', payload);
      
      if (result.success) {
        console.log('Spec updated successfully:', result);
        // Handle success (show toast, redirect, etc.)
      } else {
        setError(result.message || 'Update failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleUpdateSpec} disabled={loading}>
        {loading ? 'Updating...' : 'Update Spec'}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
};
