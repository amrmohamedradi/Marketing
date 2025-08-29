import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface HealthResponse {
  ok: boolean;
  service: string;
  now: string;
  env: {
    nodeEnv: string;
    hasDbUrl: boolean;
    commitSha: string | null;
  };
  db: {
    vendor: string | null;
    reachable: boolean;
    latencyMs: number | null;
  };
  version: string;
}

interface PingResponse {
  ok: boolean;
  echo: string;
  now: string;
}

type Status = 'PASS' | 'WARN' | 'FAIL' | 'LOADING';

const StatusBadge = ({ status }: { status: Status }) => {
  const colors = {
    PASS: 'bg-green-100 text-green-800',
    WARN: 'bg-yellow-100 text-yellow-800',
    FAIL: 'bg-red-100 text-red-800',
    LOADING: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
};

export default function HealthDebug() {
  // SSR data
  const [ssrData, setSsrData] = useState<HealthResponse | null>(null);
  const [ssrError, setSsrError] = useState<string | null>(null);
  const [ssrLatency, setSsrLatency] = useState<number | null>(null);
  
  // CSR data
  const [csrData, setCsrData] = useState<HealthResponse | null>(null);
  const [csrError, setCsrError] = useState<string | null>(null);
  const [csrLatency, setCsrLatency] = useState<number | null>(null);
  
  // Ping data
  const [pingData, setPingData] = useState<PingResponse | null>(null);
  const [pingError, setPingError] = useState<string | null>(null);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  // Simulate SSR fetch on component mount
  useEffect(() => {
    const fetchSsrData = async () => {
      const startTime = Date.now();
      try {
        const response = await fetch(`${API_BASE_URL}/health`, { cache: 'no-store' });
        const data = await response.json();
        setSsrData(data);
        setSsrLatency(Date.now() - startTime);
      } catch (error) {
        setSsrError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    fetchSsrData();
  }, []);

  // CSR fetch on component mount
  useEffect(() => {
    const fetchCsrData = async () => {
      const startTime = Date.now();
      try {
        const response = await axios.get(`${API_BASE_URL}/health`);
        setCsrData(response.data);
        setCsrLatency(Date.now() - startTime);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
            setCsrError('CORS error: Failed to fetch. Check CORS configuration on the server.');
          } else {
            setCsrError(error.message);
          }
        } else {
          setCsrError('Unknown error');
        }
      }
    };

    fetchCsrData();
  }, []);

  // Ping test
  useEffect(() => {
    const pingTest = async () => {
      const startTime = Date.now();
      try {
        const response = await axios.post(`${API_BASE_URL}/health/ping`, { message: 'Hello from debug page' });
        setPingData(response.data);
        setPingLatency(Date.now() - startTime);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setPingError(error.message);
        } else {
          setPingError('Unknown error');
        }
      }
    };

    pingTest();
  }, []);

  // Determine status for each check
  const getSsrStatus = (): Status => {
    if (!ssrData && !ssrError) return 'LOADING';
    if (ssrError) return 'FAIL';
    return ssrData?.ok ? 'PASS' : 'FAIL';
  };

  const getCsrStatus = (): Status => {
    if (!csrData && !csrError) return 'LOADING';
    if (csrError) return 'FAIL';
    return csrData?.ok ? 'PASS' : 'FAIL';
  };

  const getPingStatus = (): Status => {
    if (!pingData && !pingError) return 'LOADING';
    if (pingError) return 'FAIL';
    return pingData?.ok ? 'PASS' : 'FAIL';
  };

  const getDbStatus = (): Status => {
    if (!ssrData && !csrData) return 'LOADING';
    const data = ssrData || csrData;
    if (!data) return 'LOADING';
    if (!data.db.vendor) return 'WARN';
    return data.db.reachable ? 'PASS' : 'FAIL';
  };

  const getEnvStatus = (): Status => {
    if (!ssrData && !csrData) return 'LOADING';
    const data = ssrData || csrData;
    if (!data) return 'LOADING';
    return data.env.hasDbUrl ? 'PASS' : 'WARN';
  };

  const hasCorsIssue = !csrError ? false : csrError.includes('CORS') || csrError.includes('Failed to fetch');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">API Health Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Server-Side Render Check</h2>
          <div className="flex justify-between items-center mb-2">
            <span>Status:</span>
            <StatusBadge status={getSsrStatus()} />
          </div>
          {ssrLatency && (
            <div className="flex justify-between items-center mb-2">
              <span>Latency:</span>
              <span>{ssrLatency}ms</span>
            </div>
          )}
          {ssrError && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
              Error: {ssrError}
            </div>
          )}
          {ssrData && (
            <pre className="mt-4 p-3 bg-gray-50 rounded overflow-auto text-xs">
              {JSON.stringify(ssrData, null, 2)}
            </pre>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Client-Side Render Check</h2>
          <div className="flex justify-between items-center mb-2">
            <span>Status:</span>
            <StatusBadge status={getCsrStatus()} />
          </div>
          {csrLatency && (
            <div className="flex justify-between items-center mb-2">
              <span>Latency:</span>
              <span>{csrLatency}ms</span>
            </div>
          )}
          {csrError && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
              Error: {csrError}
            </div>
          )}
          {hasCorsIssue && (
            <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 rounded">
              <strong>CORS Issue Detected:</strong> The server needs to allow requests from {window.location.origin}
            </div>
          )}
          {csrData && (
            <pre className="mt-4 p-3 bg-gray-50 rounded overflow-auto text-xs">
              {JSON.stringify(csrData, null, 2)}
            </pre>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">POST /health/ping Check</h2>
          <div className="flex justify-between items-center mb-2">
            <span>Status:</span>
            <StatusBadge status={getPingStatus()} />
          </div>
          {pingLatency && (
            <div className="flex justify-between items-center mb-2">
              <span>Latency:</span>
              <span>{pingLatency}ms</span>
            </div>
          )}
          {pingError && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
              Error: {pingError}
            </div>
          )}
          {pingData && (
            <pre className="mt-4 p-3 bg-gray-50 rounded overflow-auto text-xs">
              {JSON.stringify(pingData, null, 2)}
            </pre>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Database:</span>
              <StatusBadge status={getDbStatus()} />
            </div>
            
            <div className="flex justify-between items-center">
              <span>Environment Variables:</span>
              <StatusBadge status={getEnvStatus()} />
            </div>

            <div className="flex justify-between items-center">
              <span>API Base URL:</span>
              <span className="text-sm font-mono">{API_BASE_URL}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>DB Vendor:</span>
              <span>{(ssrData || csrData)?.db.vendor || 'Not configured'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Node Environment:</span>
              <span>{(ssrData || csrData)?.env.nodeEnv || 'Unknown'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>API Version:</span>
              <span>{(ssrData || csrData)?.version || 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-medium mb-2">Troubleshooting Tips</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>If CSR fails but SSR works, check CORS configuration on the server.</li>
          <li>If DB connection fails, verify that the DATABASE_URL environment variable is set correctly.</li>
          <li>For local development, ensure both frontend and backend servers are running.</li>
          <li>Check that <code>VITE_API_BASE_URL</code> is set correctly in your environment.</li>
        </ul>
      </div>
    </div>
  );
}