import axios from "axios";

// Solution A: With baseURL '/api'
// Use paths like '/specs/:id' (NO '/api' prefix in calls)
export const api = axios.create({
  baseURL: "/api", // Next.js proxy prefix
  timeout: 20000,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

export default api;
