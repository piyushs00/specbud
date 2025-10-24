const mongoose = require('mongoose');
const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');
const amazonProducts = require('../data/amazonProducts');
require('dotenv').config();

// Connect to MongoDB and seed database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/specbud', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await PriceHistory.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Insert Amazon products
    const products = await Product.insertMany(amazonProducts);
    console.log(`✅ Inserted ${products.length} Amazon products`);

    // Create price history for each product
    for (const product of products) {
      const priceHistory = [];
      const basePrice = product.currentPrice;
      
      // Create price history for the last 30 days
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Simulate price fluctuations (±5%)
        const variation = (Math.random() - 0.5) * 0.1;
        const price = Math.round(basePrice * (1 + variation));
        
        priceHistory.push({
          productId: product._id,
          price,
          source: ['amazon', 'flipkart', 'reliance_digital'][Math.floor(Math.random() * 3)],
          url: product.buyLinks[0].url,
          availability: 'in_stock',
          currency: 'INR',
          timestamp: date
        });
      }
      
      await PriceHistory.insertMany(priceHistory);
    }

    console.log('✅ Created price history for all products');
    console.log('🎉 Database seeded successfully with Amazon products!');
    console.log('\n📊 Product Summary:');
    console.log(`💻 Laptops: ${products.filter(p => p.type === 'laptops').length}`);
    console.log(`📱 Phones: ${products.filter(p => p.type === 'phones').length}`);
    console.log(`🎧 Earphones: ${products.filter(p => p.type === 'earphones').length}`);
    console.log(`🏷️ Premium: ${products.filter(p => p.category === 'premium').length}`);
    console.log(`🎮 Gaming: ${products.filter(p => p.category === 'gaming').length}`);
    console.log(`💰 Budget: ${products.filter(p => p.category === 'budget').length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();