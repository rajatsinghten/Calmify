// Simple test script to verify backend connection
import { apiService } from '../services/api.js';

console.log('Testing backend connection...');

// Test health check
apiService.healthCheck()
  .then(result => {
    console.log('✅ Backend connection successful:', result);
  })
  .catch(error => {
    console.error('❌ Backend connection failed:', error.message);
  });

// Test CORS by making a simple API call
fetch('http://localhost:5000/health')
  .then(response => {
    if (response.ok) {
      console.log('✅ CORS configuration is working properly');
      return response.json();
    } else {
      console.error('❌ HTTP error:', response.status, response.statusText);
    }
  })
  .then(data => {
    console.log('Health check response:', data);
  })
  .catch(error => {
    console.error('❌ CORS or network error:', error.message);
  });