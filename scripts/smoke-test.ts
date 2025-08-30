#!/usr/bin/env tsx

/**
 * Smoke Test Script
 * 
 * Verifies basic functionality of the service-spec-maker application:
 * - Backend API health check
 * - Database connectivity
 * - Basic API endpoints
 * 
 * Usage: npm run smoke-test
 */

// Use built-in fetch (Node 18+) or polyfill

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration?: number;
}

class SmokeTest {
  private baseUrl: string;
  private results: TestResult[] = [];

  constructor(baseUrl = 'https://backend-marketing-production.up.railway.app') {
    this.baseUrl = baseUrl;
  }

  private async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    console.log(`🧪 Running: ${name}`);
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({ name, passed: true, duration });
      console.log(`✅ ${name} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.results.push({ name, passed: false, error: errorMsg, duration });
      console.log(`❌ ${name} (${duration}ms): ${errorMsg}`);
    }
  }

  private async fetchJson(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }

  async testHealthEndpoint(): Promise<void> {
    await this.runTest('Health endpoint', async () => {
      const health = await this.fetchJson('/api/health');
      
      if (!health.ok) {
        throw new Error('Health check returned ok: false');
      }
      
      if (!health.service || !health.version) {
        throw new Error('Missing required health fields');
      }
    });
  }

  async testDatabaseConnectivity(): Promise<void> {
    await this.runTest('Database connectivity', async () => {
      const health = await this.fetchJson('/api/health');
      
      if (!health.env.hasDbUrl) {
        console.log('⚠️  Database URL not configured (using mock storage)');
        return;
      }
      
      if (!health.db.reachable) {
        throw new Error('Database is not reachable');
      }
      
      if (health.db.latencyMs > 5000) {
        throw new Error(`Database latency too high: ${health.db.latencyMs}ms`);
      }
    });
  }

  async testPingEndpoint(): Promise<void> {
    await this.runTest('Ping endpoint', async () => {
      const testMessage = 'smoke-test-' + Date.now();
      const response = await this.fetchJson('/api/health/ping', {
        method: 'POST',
        body: JSON.stringify({ message: testMessage })
      });
      
      if (!response.ok) {
        throw new Error('Ping returned ok: false');
      }
      
      if (response.echo !== testMessage) {
        throw new Error(`Echo mismatch: expected "${testMessage}", got "${response.echo}"`);
      }
    });
  }

  async testSpecEndpoints(): Promise<void> {
    await this.runTest('Spec endpoints', async () => {
      const testSlug = 'smoke-test-' + Date.now();
      const testData = {
        client: { name: 'Test Client', company: 'Test Co' },
        services: [{ name: 'Test Service', price: 100 }]
      };
      
      // Test save spec
      const saveResponse = await this.fetchJson(`/api/specs/${testSlug}`, {
        method: 'POST',
        body: JSON.stringify(testData)
      });
      
      if (!saveResponse.ok) {
        throw new Error('Failed to save spec');
      }
      
      // Test get spec
      const getResponse = await this.fetchJson(`/api/specs/${testSlug}`);
      
      if (!getResponse.ok) {
        throw new Error('Failed to get spec');
      }
      
      if (!getResponse.data) {
        throw new Error('Spec data is missing');
      }
    });
  }

  async testCorsHeaders(): Promise<void> {
    await this.runTest('CORS headers', async () => {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'OPTIONS'
      });
      
      const corsHeader = response.headers.get('Access-Control-Allow-Origin');
      if (!corsHeader) {
        throw new Error('Missing CORS headers');
      }
    });
  }

  async runAll(): Promise<void> {
    console.log('🚀 Starting smoke tests...\n');
    
    await this.testHealthEndpoint();
    await this.testDatabaseConnectivity();
    await this.testPingEndpoint();
    await this.testSpecEndpoints();
    await this.testCorsHeaders();
    
    this.printSummary();
  }

  private printSummary(): void {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const failed = this.results.filter(r => !r.passed);
    
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${passed}/${total}`);
    
    if (failed.length > 0) {
      console.log(`❌ Failed: ${failed.length}/${total}`);
      console.log('\nFailures:');
      failed.forEach(test => {
        console.log(`  - ${test.name}: ${test.error}`);
      });
    }
    
    const avgDuration = this.results.reduce((sum, r) => sum + (r.duration || 0), 0) / total;
    console.log(`⏱️  Average duration: ${Math.round(avgDuration)}ms`);
    
    if (failed.length > 0) {
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed!');
    }
  }
}

// Run smoke tests
async function main() {
  const baseUrl = process.env.API_BASE_URL || 'https://backend-marketing-production.up.railway.app';
  const smokeTest = new SmokeTest(baseUrl);
  
  try {
    await smokeTest.runAll();
  } catch (error) {
    console.error('💥 Smoke test runner failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default SmokeTest;
