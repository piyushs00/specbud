const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');
const amazonService = require('../services/amazonService');
const priceTracker = require('../services/priceTracker');

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      category,
      brand,
      useCase,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      trending
    } = req.query;

    // Build filter object
    const filters = {};
    
    if (type) filters.type = type;
    if (category) filters.category = category;
    if (brand) filters.brand = new RegExp(brand, 'i');
    if (useCase) filters.useCase = { $in: [useCase] };
    if (featured !== undefined) filters.featured = featured === 'true';
    if (trending !== undefined) filters.trending = trending === 'true';
    
    if (minPrice || maxPrice) {
      filters.currentPrice = {};
      if (minPrice) filters.currentPrice.$gte = parseInt(minPrice);
      if (maxPrice) filters.currentPrice.$lte = parseInt(maxPrice);
    }
    
    if (search) {
      filters.$or = [
        { name: new RegExp(search, 'i') },
        { shortDesc: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const products = await Product.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('priceHistory');

    const total = await Product.countDocuments(filters);

    res.json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
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

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Get price history
    const priceHistory = await PriceHistory.getPriceTrend(product._id, 30);
    
    // Get price statistics
    const priceStats = await PriceHistory.getPriceStats(product._id, 30);
    
    // Get lowest price
    const lowestPrice = await PriceHistory.getLowestPrice(product._id, 30);

    res.json({
      success: true,
      data: {
        ...product.toObject(),
        priceHistory,
        priceStats: priceStats[0] || null,
        lowestPrice
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

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20, sortBy = 'rating', sortOrder = 'desc' } = req.query;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find({ 
      category,
      status: 'active' 
    })
    .sort(sort)
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Category products fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category products',
      message: error.message
    });
  }
});

// Get trending products
router.get('/trending/items', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find({ 
      trending: true,
      status: 'active' 
    })
    .sort({ rating: -1, currentPrice: 1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Trending products fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending products',
      message: error.message
    });
  }
});

// Get featured products
router.get('/featured/items', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find({ 
      featured: true,
      status: 'active' 
    })
    .sort({ rating: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Featured products fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured products',
      message: error.message
    });
  }
});

// Search products
router.get('/search/query', async (req, res) => {
  try {
    const { q, type, category, minPrice, maxPrice, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const filters = {
      $text: { $search: q },
      status: 'active'
    };

    if (type) filters.type = type;
    if (category) filters.category = category;
    if (minPrice || maxPrice) {
      filters.currentPrice = {};
      if (minPrice) filters.currentPrice.$gte = parseInt(minPrice);
      if (maxPrice) filters.currentPrice.$lte = parseInt(maxPrice);
    }

    const products = await Product.find(filters, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: products,
      query: q
    });

  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
});

// Get product recommendations
router.get('/:id/recommendations', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Find similar products based on type, category, and price range
    const priceRange = product.currentPrice * 0.2; // ±20% price range
    
    const recommendations = await Product.find({
      _id: { $ne: product._id },
      type: product.type,
      category: product.category,
      currentPrice: {
        $gte: product.currentPrice - priceRange,
        $lte: product.currentPrice + priceRange
      },
      status: 'active'
    })
    .sort({ rating: -1 })
    .limit(6);

    res.json({
      success: true,
      data: recommendations
    });

  } catch (error) {
    console.error('Recommendations fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations',
      message: error.message
    });
  }
});

// Update product price manually
router.post('/:id/update-price', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Update price using price tracker
    await priceTracker.updateProductPrice(product);

    // Fetch updated product
    const updatedProduct = await Product.findById(req.params.id);

    res.json({
      success: true,
      data: updatedProduct,
      message: 'Price updated successfully'
    });

  } catch (error) {
    console.error('Price update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update price',
      message: error.message
    });
  }
});

// Get product price history
router.get('/:id/price-history', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const priceHistory = await PriceHistory.getPriceTrend(req.params.id, parseInt(days));
    const priceStats = await PriceHistory.getPriceStats(req.params.id, parseInt(days));
    const lowestPrice = await PriceHistory.getLowestPrice(req.params.id, parseInt(days));

    res.json({
      success: true,
      data: {
        history: priceHistory,
        statistics: priceStats[0] || null,
        lowestPrice,
        days: parseInt(days)
      }
    });

  } catch (error) {
    console.error('Price history fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch price history',
      message: error.message
    });
  }
});

// Compare products
router.post('/compare', async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'At least 2 product IDs are required for comparison'
      });
    }

    const products = await Product.find({
      _id: { $in: productIds },
      status: 'active'
    });

    if (products.length !== productIds.length) {
      return res.status(404).json({
        success: false,
        error: 'One or more products not found'
      });
    }

    // Get price histories for comparison
    const priceHistories = {};
    for (const product of products) {
      priceHistories[product._id] = await PriceHistory.getPriceTrend(product._id, 30);
    }

    res.json({
      success: true,
      data: {
        products,
        priceHistories
      }
    });

  } catch (error) {
    console.error('Product comparison error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare products',
      message: error.message
    });
  }
});

module.exports = router;
