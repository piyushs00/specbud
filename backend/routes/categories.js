const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all categories with product counts
router.get('/', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$currentPrice' },
          minPrice: { $min: '$currentPrice' },
          maxPrice: { $max: '$currentPrice' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get featured products for each category
    const categoriesWithFeatured = await Promise.all(
      categories.map(async (category) => {
        const featuredProducts = await Product.find({
          category: category._id,
          status: 'active',
          featured: true
        })
        .sort({ rating: -1 })
        .limit(3)
        .select('name image currentPrice rating');

        return {
          ...category,
          featuredProducts
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithFeatured
    });

  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// Get products by category
router.get('/:category/products', async (req, res) => {
  try {
    const { category } = req.params;
    const {
      type,
      brand,
      minPrice,
      maxPrice,
      sortBy = 'rating',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build filters
    const filters = {
      category,
      status: 'active'
    };

    if (type) filters.type = type;
    if (brand) filters.brand = new RegExp(brand, 'i');
    
    if (minPrice || maxPrice) {
      filters.currentPrice = {};
      if (minPrice) filters.currentPrice.$gte = parseInt(minPrice);
      if (maxPrice) filters.currentPrice.$lte = parseInt(maxPrice);
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
      .limit(parseInt(limit));

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
    console.error('Category products fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category products',
      message: error.message
    });
  }
});

// Get category statistics
router.get('/:category/stats', async (req, res) => {
  try {
    const { category } = req.params;

    const stats = await Product.aggregate([
      {
        $match: {
          category,
          status: 'active'
        }
      },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          avgPrice: { $avg: '$currentPrice' },
          minPrice: { $min: '$currentPrice' },
          maxPrice: { $max: '$currentPrice' },
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: '$reviewCount' }
        }
      }
    ]);

    // Get price distribution
    const priceDistribution = await Product.aggregate([
      {
        $match: {
          category,
          status: 'active'
        }
      },
      {
        $bucket: {
          groupBy: '$currentPrice',
          boundaries: [0, 10000, 25000, 50000, 100000, 200000, 500000, 1000000],
          default: '1000000+',
          output: {
            count: { $sum: 1 },
            products: { $push: { name: '$name', price: '$currentPrice' } }
          }
        }
      }
    ]);

    // Get brand distribution
    const brandDistribution = await Product.aggregate([
      {
        $match: {
          category,
          status: 'active'
        }
      },
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 },
          avgPrice: { $avg: '$currentPrice' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get type distribution
    const typeDistribution = await Product.aggregate([
      {
        $match: {
          category,
          status: 'active'
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        priceDistribution,
        brandDistribution,
        typeDistribution
      }
    });

  } catch (error) {
    console.error('Category stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category statistics',
      message: error.message
    });
  }
});

// Get category filters
router.get('/:category/filters', async (req, res) => {
  try {
    const { category } = req.params;

    const filters = {
      category,
      status: 'active'
    };

    // Get available brands
    const brands = await Product.distinct('brand', filters);
    
    // Get available types
    const types = await Product.distinct('type', filters);
    
    // Get available use cases
    const useCases = await Product.distinct('useCase', filters);
    
    // Get price range
    const priceStats = await Product.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$currentPrice' },
          maxPrice: { $max: '$currentPrice' },
          avgPrice: { $avg: '$currentPrice' }
        }
      }
    ]);

    // Get rating distribution
    const ratingDistribution = await Product.aggregate([
      { $match: filters },
      {
        $bucket: {
          groupBy: '$rating',
          boundaries: [0, 1, 2, 3, 4, 5],
          default: '5',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        brands: brands.sort(),
        types: types.sort(),
        useCases: useCases.sort(),
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 },
        ratingDistribution
      }
    });

  } catch (error) {
    console.error('Category filters error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category filters',
      message: error.message
    });
  }
});

// Get trending products in category
router.get('/:category/trending', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const trendingProducts = await Product.find({
      category,
      status: 'active',
      trending: true
    })
    .sort({ rating: -1, currentPrice: 1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: trendingProducts
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

// Get best deals in category
router.get('/:category/deals', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10, minDiscount = 10 } = req.query;

    const deals = await Product.find({
      category,
      status: 'active',
      currentPrice: { $lt: { $field: 'basePrice' } }
    })
    .sort({ discountPercentage: -1 })
    .limit(parseInt(limit));

    // Filter by minimum discount
    const filteredDeals = deals.filter(product => {
      const discount = ((product.basePrice - product.currentPrice) / product.basePrice) * 100;
      return discount >= parseInt(minDiscount);
    });

    res.json({
      success: true,
      data: filteredDeals
    });

  } catch (error) {
    console.error('Category deals error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category deals',
      message: error.message
    });
  }
});

// Get category comparison
router.get('/compare', async (req, res) => {
  try {
    const { categories } = req.query;

    if (!categories) {
      return res.status(400).json({
        success: false,
        error: 'Categories parameter is required'
      });
    }

    const categoryList = categories.split(',');
    
    const comparison = await Promise.all(
      categoryList.map(async (category) => {
        const stats = await Product.aggregate([
          {
            $match: {
              category,
              status: 'active'
            }
          },
          {
            $group: {
              _id: null,
              totalProducts: { $sum: 1 },
              avgPrice: { $avg: '$currentPrice' },
              minPrice: { $min: '$currentPrice' },
              maxPrice: { $max: '$currentPrice' },
              avgRating: { $avg: '$rating' },
              totalReviews: { $sum: '$reviewCount' }
            }
          }
        ]);

        const topProducts = await Product.find({
          category,
          status: 'active'
        })
        .sort({ rating: -1 })
        .limit(3)
        .select('name image currentPrice rating');

        return {
          category,
          stats: stats[0] || {},
          topProducts
        };
      })
    );

    res.json({
      success: true,
      data: comparison
    });

  } catch (error) {
    console.error('Category comparison error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare categories',
      message: error.message
    });
  }
});

module.exports = router;
