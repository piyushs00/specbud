const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up SpecBud Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from env.example');
    console.log('⚠️  Please update .env with your actual configuration\n');
  } else {
    console.log('❌ env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Create necessary directories
const directories = [
  'logs',
  'data',
  'temp'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

console.log('\n📋 Setup Instructions:');
console.log('1. Update .env file with your configuration');
console.log('2. Install dependencies: npm install');
console.log('3. Start MongoDB service');
console.log('4. Seed database: npm run seed');
console.log('5. Start development server: npm run dev');
console.log('6. Start production server: npm start\n');

console.log('🔧 Configuration Required:');
console.log('- MongoDB URI (default: mongodb://localhost:27017/specbud)');
console.log('- Amazon API credentials (optional)');
console.log('- JWT secret key');
console.log('- Frontend URL for CORS\n');

console.log('📚 Available Scripts:');
console.log('- npm run dev: Start development server');
console.log('- npm start: Start production server');
console.log('- npm run seed: Seed database with sample data');
console.log('- npm test: Run tests\n');

console.log('🌐 API Endpoints:');
console.log('- Health: GET /health');
console.log('- Products: GET /api/products');
console.log('- Search: GET /api/search');
console.log('- Prices: GET /api/prices');
console.log('- Categories: GET /api/categories\n');

console.log('✅ Setup completed successfully!');
console.log('🚀 Ready to start development');
