// Test script for comparison functionality
const testComparison = async () => {
  try {
    // Test if backend is running
    const response = await fetch('http://localhost:5000/api/products');
    if (!response.ok) {
      throw new Error(`Backend not running: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Backend is running');
    console.log(`📦 Found ${data.data?.length || 0} products`);
    
    if (data.data && data.data.length >= 2) {
      // Test comparison API
      const productIds = data.data.slice(0, 2).map(p => p._id);
      console.log('🔄 Testing comparison API...');
      
      const compareResponse = await fetch('http://localhost:5000/api/products/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds })
      });
      
      if (compareResponse.ok) {
        const compareData = await compareResponse.json();
        console.log('✅ Comparison API working');
        console.log(`📊 Comparing ${compareData.data.products.length} products`);
        
        // Show product names being compared
        compareData.data.products.forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.name} - ₹${product.currentPrice}`);
        });
      } else {
        console.log('❌ Comparison API failed:', compareResponse.status);
      }
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('💡 Make sure the backend server is running on port 5000');
  }
};

// Run the test
testComparison();
