import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import amazonProducts from './data/amazonProducts.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting - More lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
// Temporarily disable rate limiting for development
// app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'SpecBud Backend is running!'
  });
});

// API Routes
app.get('/api/products', (req, res) => {
  const { type, category, search, page = 1, limit = 20 } = req.query;
  
  // Use comprehensive Amazon database
  let filteredProducts = [...amazonProducts];
  
  // Filter by type
  if (type) {
    filteredProducts = filteredProducts.filter(p => p.type === type);
  }
  
  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  // Search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.shortDesc.toLowerCase().includes(searchLower)
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedProducts,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(filteredProducts.length / parseInt(limit)),
      total: filteredProducts.length,
      limit: parseInt(limit)
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = amazonProducts.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

app.get('/api/products/trending/items', (req, res) => {
  const trendingProducts = amazonProducts.filter(p => p.trending);
  res.json({
    success: true,
    data: trendingProducts
  });
});

app.get('/api/products/featured/items', (req, res) => {
  const featuredProducts = amazonProducts.filter(p => p.featured);
  res.json({
    success: true,
    data: featuredProducts
  });
});

app.get('/api/search', (req, res) => {
  const { q, type, category } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Search query is required'
    });
  }
  
  let results = amazonProducts.filter(p => 
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.shortDesc.toLowerCase().includes(q.toLowerCase())
  );
  
  if (type) {
    results = results.filter(p => p.type === type);
  }
  
  if (category) {
    results = results.filter(p => p.category === category);
  }
  
  res.json({
    success: true,
    data: results,
    query: q
  });
});

app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 'gaming', name: 'Best for Gaming', icon: '🎮', color: 'bg-blue-500', description: 'High-performance gaming laptops and desktops' },
    { id: 'office', name: 'Best for Office', icon: '💼', color: 'bg-green-500', description: 'Professional productivity machines' },
    { id: 'budget', name: 'Best Budget', icon: '💰', color: 'bg-yellow-500', description: 'Great value for money options' },
    { id: 'premium', name: 'Best Premium', icon: '👑', color: 'bg-purple-500', description: 'Top-tier luxury devices' },
  ];
  
  res.json({
    success: true,
    data: categories
  });
});

// Compare products endpoint
app.post('/api/products/compare', (req, res) => {
  const { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'At least 2 product IDs are required for comparison'
    });
  }

  const products = amazonProducts.filter(p => productIds.includes(p.id));

  if (products.length !== productIds.length) {
    return res.status(404).json({
      success: false,
      error: 'One or more products not found'
    });
  }

  res.json({
    success: true,
    data: {
      products,
      priceHistories: {} // Empty for now since we don't have price history in simple server
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SpecBud Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: development`);
  console.log(`🌐 CORS enabled for: http://localhost:3000`);
  console.log(`✅ Server ready! Test with: http://localhost:${PORT}/health`);
  console.log(`📱 API endpoints available at: http://localhost:${PORT}/api/`);
  console.log(`📦 Loaded ${amazonProducts.length} products`);
});

export default app;
