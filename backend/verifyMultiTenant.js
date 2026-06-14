const http = require('http');

function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runTests() {
  console.log('--- STARTING VERIFICATION TESTS ---');

  try {
    // Test 1: Test original API (default DB)
    console.log('Testing Test 1: Original API path (/api/profile)...');
    const res1 = await testEndpoint('http://localhost:5000/api/profile?student_id=nonexistent');
    console.log(`Test 1 Status Code: ${res1.statusCode}`);
    console.log(`Test 1 Response Data: ${res1.data}`);
    
    // Test 2: Test multi-tenant API path with configured institute (TEST DB)
    console.log('\nTesting Test 2: Multi-tenant API path (/inst/test/api/profile)...');
    const res2 = await testEndpoint('http://localhost:5000/inst/test/api/profile?student_id=nonexistent');
    console.log(`Test 2 Status Code: ${res2.statusCode}`);
    console.log(`Test 2 Response Data: ${res2.data}`);

    // Test 3: Test multi-tenant API path with unconfigured institute (should fallback to default pool with warning)
    console.log('\nTesting Test 3: Multi-tenant API path with unconfigured institute (/inst/unconfigured/api/profile)...');
    const res3 = await testEndpoint('http://localhost:5000/inst/unconfigured/api/profile?student_id=nonexistent');
    console.log(`Test 3 Status Code: ${res3.statusCode}`);
    console.log(`Test 3 Response Data: ${res3.data}`);

  } catch (err) {
    console.error('Test error:', err);
  }
  
  console.log('\n--- VERIFICATION TESTS COMPLETED ---');
}

runTests();
