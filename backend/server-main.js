const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const SimpleDB = require('./config/database-simple');
const amazonProducts = require('./data/amazonProducts');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting - More lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

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
    message: 'SpecBud Main Server is running!',
    database: 'In-Memory Database'
  });
});

// Initialize database with Amazon products
async function initializeDatabase() {
  try {
    await SimpleDB.initializeWithAmazonProducts(amazonProducts);
    console.log('📊 Database initialized with Amazon products');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const { type, category, search, page = 1, limit = 20, featured, trending } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) filter.search = search;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (trending !== undefined) filter.trending = trending === 'true';
    
    const allProducts = await SimpleDB.findProducts(filter);
    
    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(allProducts.length / parseInt(limit)),
        total: allProducts.length,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await SimpleDB.findProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Get price history
    const priceHistory = await SimpleDB.findPriceHistory({
      productId: req.params.id,
      days: 30
    });
    
    res.json({
      success: true,
      data: {
        ...product,
        priceHistory
      }
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

app.get('/api/products/trending/items', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const trendingProducts = await SimpleDB.findProducts({ trending: true });
    const limitedProducts = trendingProducts.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: limitedProducts
    });
  } catch (error) {
    console.error('Trending products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending products',
      message: error.message
    });
  }
});

app.get('/api/products/featured/items', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const featuredProducts = await SimpleDB.findProducts({ featured: true });
    const limitedProducts = featuredProducts.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: limitedProducts
    });
  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured products',
      message: error.message
    });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q, type, category } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const filter = { search: q };
    if (type) filter.type = type;
    if (category) filter.category = category;
    
    const results = await SimpleDB.findProducts(filter);
    
    res.json({
      success: true,
      data: results,
      query: q
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

app.get('/api/prices/current', async (req, res) => {
  try {
    const { productIds } = req.query;
    
    if (!productIds) {
      return res.status(400).json({
        success: false,
        error: 'Product IDs are required'
      });
    }
    
    const ids = productIds.split(',');
    const products = [];
    
    for (const id of ids) {
      const product = await SimpleDB.findProductById(id);
      if (product) {
        products.push({
          _id: product._id,
          name: product.name,
          currentPrice: product.currentPrice,
          currency: product.currency,
          lastPriceUpdate: product.updatedAt
        });
      }
    }
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Current prices error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch current prices',
      message: error.message
    });
  }
});

app.get('/api/prices/history/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { days = 30 } = req.query;
    
    const priceHistory = await SimpleDB.findPriceHistory({
      productId,
      days: parseInt(days)
    });
    
    res.json({
      success: true,
      data: {
        history: priceHistory,
        days: parseInt(days)
      }
    });
  } catch (error) {
    console.error('Price history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch price history',
      message: error.message
    });
  }
});

// Database stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await SimpleDB.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats',
      message: error.message
    });
  }
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
app.listen(PORT, async () => {
  console.log(`🚀 SpecBud Main Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`💾 Database: In-Memory with Amazon Products`);
  
  // Initialize database
  await initializeDatabase();
  
  console.log(`✅ Server ready! Test with: http://localhost:${PORT}/health`);
  console.log(`📱 API endpoints available at: http://localhost:${PORT}/api/`);
});

module.exports = app;
