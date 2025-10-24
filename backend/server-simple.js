const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

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

// Import comprehensive Amazon product database
const amazonProducts = require('./data/amazonProducts');

// Sample products data (from your frontend) - fallback data
const sampleProducts = [
  {
    id: 1,
    type: "laptops",
    name: "MacBook Air M2",
    shortDesc: "Ultra-thin and powerful for creative professionals",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop",
    price: 99900,
    currentPrice: 99900,
    specs: {
      processor: "Apple M2 Chip",
      graphics: "8-core GPU",
      display: "13.6\" Liquid Retina",
    },
    launched: "July 2022",
    investment: "Excellent choice for students and professionals. The M2 chip offers incredible performance with great battery life. Perfect for coding, design, and everyday tasks.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Reliance Digital", url: "https://reliancedigital.in" },
      { site: "Croma", url: "https://croma.com" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=macbook-air-m2-review",
      "https://youtube.com/watch?v=macbook-air-m2-unboxing"
    ],
    useCase: ["office", "casual", "creative"],
    rating: 4.5,
    reviewCount: 1250,
    featured: true,
    trending: true
  },
  {
    id: 2,
    type: "laptops",
    name: "Dell XPS 13",
    shortDesc: "Premium ultrabook with stunning display",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop",
    price: 129900,
    currentPrice: 119900,
    specs: {
      processor: "Intel i7-1260P",
      graphics: "Intel Iris Xe",
      display: "13.4\" 4K Touch",
    },
    launched: "March 2022",
    investment: "Great for business professionals and content creators. Premium build quality with excellent display. Slightly expensive but worth it for the build quality.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Dell Official", url: "https://dell.com" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=dell-xps-13-review"
    ],
    useCase: ["office", "creative"],
    rating: 4.3,
    reviewCount: 890,
    featured: true,
    trending: false
  },
  {
    id: 3,
    type: "laptops",
    name: "ASUS ROG Strix G15",
    shortDesc: "Gaming powerhouse with RTX graphics",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=400&fit=crop",
    price: 89900,
    currentPrice: 84900,
    specs: {
      processor: "AMD Ryzen 7 6800H",
      graphics: "RTX 3060",
      display: "15.6\" FHD 144Hz",
    },
    launched: "January 2022",
    investment: "Perfect for gamers and content creators. Great value for money with powerful specs. The 144Hz display makes gaming smooth and enjoyable.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "ASUS Store", url: "https://asus.com" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=asus-rog-strix-g15-review"
    ],
    useCase: ["gaming", "creative"],
    rating: 4.4,
    reviewCount: 2100,
    featured: false,
    trending: true
  },
  {
    id: 4,
    type: "phones",
    name: "iPhone 14 Pro",
    shortDesc: "Latest iPhone with Dynamic Island and A16 Bionic",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=400&fit=crop",
    price: 129900,
    currentPrice: 124900,
    specs: {
      processor: "A16 Bionic",
      graphics: "6-core GPU",
      display: "6.1\" Super Retina XDR",
    },
    launched: "September 2022",
    investment: "Top-tier smartphone with excellent camera system and performance. The Dynamic Island is innovative and useful. Great for photography enthusiasts and power users.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Apple Store", url: "https://apple.com" },
      { site: "Reliance Digital", url: "https://reliancedigital.in" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=iphone-14-pro-review",
      "https://youtube.com/watch?v=iphone-14-pro-camera-test"
    ],
    useCase: ["casual", "creative", "office"],
    rating: 4.6,
    reviewCount: 3200,
    featured: true,
    trending: true
  },
  {
    id: 5,
    type: "phones",
    name: "Samsung Galaxy S23 Ultra",
    shortDesc: "Android flagship with S Pen and 200MP camera",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop",
    price: 124999,
    currentPrice: 119999,
    specs: {
      processor: "Snapdragon 8 Gen 2",
      graphics: "Adreno 740",
      display: "6.8\" Dynamic AMOLED 2X",
    },
    launched: "February 2023",
    investment: "Excellent Android flagship with S Pen functionality. Great for note-taking and productivity. The camera system is outstanding for photography and videography.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Samsung Store", url: "https://samsung.com" },
      { site: "Croma", url: "https://croma.com" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=galaxy-s23-ultra-review"
    ],
    useCase: ["creative", "office", "gaming"],
    rating: 4.5,
    reviewCount: 2800,
    featured: true,
    trending: false
  },
  {
    id: 6,
    type: "earphones",
    name: "AirPods Pro 2",
    shortDesc: "Premium wireless earbuds with active noise cancellation",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=400&fit=crop",
    price: 24900,
    currentPrice: 22900,
    specs: {
      processor: "H2 Chip",
      graphics: "N/A",
      display: "N/A",
    },
    launched: "September 2022",
    investment: "Best-in-class noise cancellation and sound quality. Perfect for iPhone users with seamless integration. Great for calls, music, and productivity.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Apple Store", url: "https://apple.com" },
      { site: "Reliance Digital", url: "https://reliancedigital.in" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=airpods-pro-2-review"
    ],
    useCase: ["casual", "office"],
    rating: 4.7,
    reviewCount: 4500,
    featured: false,
    trending: true
  }
];

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
});

module.exports = app;
