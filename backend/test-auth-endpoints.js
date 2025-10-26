// Simple test script to verify authentication endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testAuthEndpoints() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test signup
    console.log('1. Testing Signup...');
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }),
    });

    const signupData = await signupResponse.json();
    console.log('Signup Response:', signupData);

    if (signupData.success) {
      console.log('✅ Signup successful!');
      
      // Test login
      console.log('\n2. Testing Login...');
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        }),
      });

      const loginData = await loginResponse.json();
      console.log('Login Response:', loginData);

      if (loginData.success) {
        console.log('✅ Login successful!');
        console.log('🎉 All authentication tests passed!');
      } else {
        console.log('❌ Login failed:', loginData.message);
      }
    } else {
      console.log('❌ Signup failed:', signupData.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAuthEndpoints();
