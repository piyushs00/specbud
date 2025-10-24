import React, { useState } from 'react';
import { useHealth, useProducts } from '../hooks/useApi';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const { data: healthData, loading: healthLoading, error: healthError } = useHealth();
  const { data: productsData, loading: productsLoading, error: productsError } = useProducts({ limit: 3 });

  const runTests = async () => {
    const results = {};
    
    // Test health endpoint
    try {
      const healthResponse = await fetch('http://localhost:5000/health');
      const healthData = await healthResponse.json();
      results.health = { success: true, data: healthData };
    } catch (error) {
      results.health = { success: false, error: error.message };
    }

    // Test products endpoint
    try {
      const productsResponse = await fetch('http://localhost:5000/api/products?limit=3');
      const productsData = await productsResponse.json();
      results.products = { success: true, data: productsData };
    } catch (error) {
      results.products = { success: false, error: error.message };
    }

    // Test search endpoint
    try {
      const searchResponse = await fetch('http://localhost:5000/api/search?q=laptop');
      const searchData = await searchResponse.json();
      results.search = { success: true, data: searchData };
    } catch (error) {
      results.search = { success: false, error: error.message };
    }

    setTestResults(results);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 m-4">
      <h2 className="text-2xl font-bold text-white mb-4">🔗 API Connection Test</h2>
      
      <button
        onClick={runTests}
        className="bg-accent-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors mb-6"
      >
        Test API Connection
      </button>

      {/* Health Status */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Health Check:</h3>
        {healthLoading ? (
          <p className="text-yellow-400">Loading...</p>
        ) : healthError ? (
          <p className="text-red-400">❌ Error: {healthError}</p>
        ) : healthData ? (
          <p className="text-green-400">✅ Backend is running! Status: {healthData.status}</p>
        ) : (
          <p className="text-gray-400">Not tested yet</p>
        )}
      </div>

      {/* Products Status */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Products API:</h3>
        {productsLoading ? (
          <p className="text-yellow-400">Loading...</p>
        ) : productsError ? (
          <p className="text-red-400">❌ Error: {productsError}</p>
        ) : productsData ? (
          <p className="text-green-400">✅ Found {productsData.data?.length || 0} products</p>
        ) : (
          <p className="text-gray-400">Not tested yet</p>
        )}
      </div>

      {/* Manual Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">Manual Test Results:</h3>
          {Object.entries(testResults).map(([endpoint, result]) => (
            <div key={endpoint} className="mb-2">
              <span className="font-medium text-white">{endpoint}:</span>
              {result.success ? (
                <span className="text-green-400 ml-2">✅ Success</span>
              ) : (
                <span className="text-red-400 ml-2">❌ {result.error}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Backend Status */}
      <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">Backend Status:</h3>
        <p className="text-gray-300">
          Backend should be running on <code className="bg-gray-600 px-2 py-1 rounded">http://localhost:5000</code>
        </p>
        <p className="text-gray-300 mt-2">
          If tests fail, make sure the backend server is running with: <code className="bg-gray-600 px-2 py-1 rounded">node server-simple.js</code>
        </p>
      </div>
    </div>
  );
};

export default ApiTest;
