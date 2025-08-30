import axios from "axios";

// Solution B: Without baseURL
// Use full paths like '/api/specs/:id' in all calls
export const api = axios.create({
  timeout: 20000,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

export default api;
