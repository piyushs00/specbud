// Test script to verify Amazon product data
const amazonProducts = require('./data/amazonProducts');

console.log('🔍 Testing Amazon Product Database...\n');

console.log(`📊 Total Products: ${amazonProducts.length}\n`);

// Test laptops
const laptops = amazonProducts.filter(p => p.type === 'laptops');
console.log(`💻 Laptops (${laptops.length}):`);
laptops.forEach(laptop => {
  console.log(`  - ${laptop.name} (₹${laptop.currentPrice.toLocaleString()})`);
});

console.log('\n📱 Phones:');
const phones = amazonProducts.filter(p => p.type === 'phones');
console.log(`📱 Phones (${phones.length}):`);
phones.forEach(phone => {
  console.log(`  - ${phone.name} (₹${phone.currentPrice.toLocaleString()})`);
});

console.log('\n🏷️ Categories:');
const categories = [...new Set(amazonProducts.map(p => p.category))];
categories.forEach(category => {
  const count = amazonProducts.filter(p => p.category === category).length;
  console.log(`  - ${category}: ${count} products`);
});

console.log('\n✅ Data verification complete!');

