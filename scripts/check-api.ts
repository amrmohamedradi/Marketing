import axios from 'axios';

// Parse command line arguments
const args = process.argv.slice(2);
let baseUrl = process.env.VITE_API_BASE_URL || 'https://backend-marketing-production.up.railway.app';

// Check for --base argument
const baseIndex = args.indexOf('--base');
if (baseIndex !== -1 && args.length > baseIndex + 1) {
  baseUrl = args[baseIndex + 1];
}

console.log(`🔍 Checking API health at ${baseUrl}...`);

async function checkApiHealth() {
  let exitCode = 0;
  
  // Check GET /health
  try {
    console.log('\n📡 Testing GET /health...');
    const startTime = Date.now();
    const response = await axios.get(`${baseUrl}/health`);
    const latency = Date.now() - startTime;
    
    if (response.data.ok) {
      console.log(`✅ GET /health: Success (${latency}ms)`);
      console.log(`   Service: ${response.data.service}`);
      console.log(`   Version: ${response.data.version}`);
      console.log(`   Environment: ${response.data.env.nodeEnv}`);
      
      if (response.data.db.vendor) {
        const dbStatus = response.data.db.reachable ? '✅ Connected' : '❌ Disconnected';
        console.log(`   Database (${response.data.db.vendor}): ${dbStatus}`);
        if (response.data.db.reachable) {
          console.log(`   DB Latency: ${response.data.db.latencyMs}ms`);
        }
      } else {
        console.log('   Database: Not configured');
      }
    } else {
      console.log('❌ GET /health: Failed - API returned ok: false');
      exitCode = 1;
    }
  } catch (error) {
    console.error('❌ GET /health: Failed with error:');
    if (axios.isAxiosError(error)) {
      console.error(`   ${error.message}`);
      if (error.response) {
        console.error(`   Status: ${error.response.status}`);
        console.error(`   Data: ${JSON.stringify(error.response.data)}`);
      }
    } else {
      console.error(`   ${error}`);
    }
    exitCode = 1;
  }
  
  // Check POST /health/ping
  try {
    console.log('\n📡 Testing POST /health/ping...');
    const message = 'Hello from check-api script';
    const startTime = Date.now();
    const response = await axios.post(`${baseUrl}/health/ping`, { message });
    const latency = Date.now() - startTime;
    
    if (response.data.ok && response.data.echo === message) {
      console.log(`✅ POST /health/ping: Success (${latency}ms)`);
      console.log(`   Echo: "${response.data.echo}"`);
    } else {
      console.log('❌ POST /health/ping: Failed - Incorrect response');
      console.log(`   Expected echo: "${message}"`);
      console.log(`   Received: ${JSON.stringify(response.data)}`);
      exitCode = 1;
    }
  } catch (error) {
    console.error('❌ POST /health/ping: Failed with error:');
    if (axios.isAxiosError(error)) {
      console.error(`   ${error.message}`);
      if (error.response) {
        console.error(`   Status: ${error.response.status}`);
        console.error(`   Data: ${JSON.stringify(error.response.data)}`);
      }
    } else {
      console.error(`   ${error}`);
    }
    exitCode = 1;
  }
  
  // Summary
  console.log('\n📊 Health Check Summary:');
  if (exitCode === 0) {
    console.log('✅ All checks passed!');
  } else {
    console.log('❌ Some checks failed. See details above.');
  }
  
  process.exit(exitCode);
}

checkApiHealth().catch(error => {
  console.error('Unexpected error during health check:', error);
  process.exit(1);
});