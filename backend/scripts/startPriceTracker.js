const priceTracker = require('../services/priceTracker');

// Start the price tracker service
console.log('🚀 Starting SpecBud Backend Services...');

// Initialize price tracker
priceTracker.start();

console.log('✅ Price tracker started successfully');
console.log('📊 Price updates will run automatically');
console.log('🔄 Check logs for update status');

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n⏹️ Stopping price tracker...');
  priceTracker.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️ Stopping price tracker...');
  priceTracker.stop();
  process.exit(0);
});
