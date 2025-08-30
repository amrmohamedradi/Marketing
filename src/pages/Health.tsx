import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Database, Server, Wifi } from 'lucide-react';
import { safeFetch } from '@/lib/safeFetch';

interface HealthData {
  ok: boolean;
  service: string;
  now: string;
  env: {
    nodeEnv: string;
    hasDbUrl: boolean;
    commitSha?: string;
  };
  db: {
    vendor: string;
    reachable: boolean;
    latencyMs?: number;
  };
  version: string;
}

interface HealthStatus {
  loading: boolean;
  data: HealthData | null;
  error: string | null;
  lastChecked: Date | null;
}

export default function Health() {
  const [status, setStatus] = useState<HealthStatus>({
    loading: true,
    data: null,
    error: null,
    lastChecked: null
  });

  const checkHealth = async () => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await safeFetch('/api/health');
      setStatus({
        loading: false,
        data,
        error: null,
        lastChecked: new Date()
      });
    } catch (error) {
      setStatus({
        loading: false,
        data: null,
        error: error instanceof Error ? error.message : 'Health check failed',
        lastChecked: new Date()
      });
    }
  };

  useEffect(() => {
    checkHealth();
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (isHealthy: boolean, loading: boolean) => {
    if (loading) return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
    return isHealthy 
      ? <CheckCircle className="h-5 w-5 text-green-500" />
      : <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusColor = (isHealthy: boolean) => {
    return isHealthy ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">System Health</h1>
          <p className="text-muted-foreground">
            Monitor the status of backend services and database connectivity
          </p>
        </div>

        {/* Overall Status Card */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Overall Status</h2>
            <button
              onClick={checkHealth}
              disabled={status.loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {status.loading ? 'Checking...' : 'Refresh'}
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            {getStatusIcon(!!status.data?.ok && !status.error, status.loading)}
            <span className={`text-lg font-medium ${
              status.error ? 'text-red-600' : 
              status.data?.ok ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {status.error ? 'Unhealthy' : 
               status.data?.ok ? 'Healthy' : 'Unknown'}
            </span>
          </div>
          
          {status.lastChecked && (
            <p className="text-sm text-muted-foreground mt-2">
              Last checked: {status.lastChecked.toLocaleString()}
            </p>
          )}
        </div>

        {/* Error Display */}
        {status.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-medium text-red-800">Connection Error</h3>
            </div>
            <p className="text-red-700 mt-1">{status.error}</p>
          </div>
        )}

        {/* Service Details */}
        {status.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* API Service */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Server className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">API Service</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={getStatusColor(status.data.ok)}>
                    {status.data.ok ? 'Running' : 'Down'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Environment:</span>
                  <span className="text-foreground">{status.data.env.nodeEnv}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="text-foreground">{status.data.version}</span>
                </div>
                {status.data.env.commitSha && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commit:</span>
                    <span className="text-foreground font-mono text-sm">
                      {status.data.env.commitSha.substring(0, 8)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Database */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Database</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={getStatusColor(status.data.db.reachable)}>
                    {status.data.db.reachable ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-foreground capitalize">{status.data.db.vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Config:</span>
                  <span className={getStatusColor(status.data.env.hasDbUrl)}>
                    {status.data.env.hasDbUrl ? 'Configured' : 'Missing URL'}
                  </span>
                </div>
                {status.data.db.latencyMs !== null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Latency:</span>
                    <span className="text-foreground">{status.data.db.latencyMs}ms</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Wifi className="h-4 w-4" />
              <span>Go to App</span>
            </button>
            <button
              onClick={() => window.open('/api/health', '_blank')}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-border text-foreground rounded-md hover:bg-accent transition-colors"
            >
              <Server className="h-4 w-4" />
              <span>Raw API Response</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
