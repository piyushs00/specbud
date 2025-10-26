import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();
import amazonService from '../services/amazonService.js';

// Global search across all products
router.get('/', async (req, res) => {
  try {
    const {
      q,
      type,
      category,
      brand,
      minPrice,
      maxPrice,
      useCase,
      sortBy = 'relevance',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    // Build search filters
    const filters = {
      status: 'active'
    };

    // Text search
    if (q) {
      filters.$text = { $search: q };
    }

    // Additional filters
    if (type) filters.type = type;
    if (category) filters.category = category;
    if (brand) filters.brand = new RegExp(brand, 'i');
    if (useCase) filters.useCase = { $in: [useCase] };
    
    if (minPrice || maxPrice) {
      filters.currentPrice = {};
      if (minPrice) filters.currentPrice.$gte = parseInt(minPrice);
      if (maxPrice) filters.currentPrice.$lte = parseInt(maxPrice);
    }

    // Build sort object
    let sort = {};
    if (sortBy === 'relevance' && q) {
      sort = { score: { $meta: 'textScore' } };
    } else if (sortBy === 'price') {
      sort.currentPrice = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'rating') {
      sort.rating = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'newest') {
      sort.createdAt = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search
    const products = await Product.find(filters, { score: { $meta: 'textScore' } })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filters);

    // Get search suggestions
    const suggestions = await getSearchSuggestions(q);

    res.json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      },
      suggestions,
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

// Search with filters
router.post('/filtered', async (req, res) => {
  try {
    const {
      query,
      filters = {},
      sort = { createdAt: -1 },
      page = 1,
      limit = 20
    } = req.body;

    // Build search criteria
    const searchCriteria = {
      status: 'active',
      ...filters
    };

    // Add text search if query provided
    if (query) {
      searchCriteria.$text = { $search: query };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search
    const products = await Product.find(searchCriteria, { score: { $meta: 'textScore' } })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(searchCriteria);

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
    console.error('Filtered search error:', error);
    res.status(500).json({
      success: false,
      error: 'Filtered search failed',
      message: error.message
    });
  }
});

// Search Amazon products
router.get('/amazon', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const amazonProducts = await amazonService.searchProducts(q, parseInt(limit));

    res.json({
      success: true,
      data: amazonProducts,
      query: q
    });

  } catch (error) {
    console.error('Amazon search error:', error);
    res.status(500).json({
      success: false,
      error: 'Amazon search failed',
      message: error.message
    });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const suggestions = await getSearchSuggestions(q, parseInt(limit));

    res.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch suggestions',
      message: error.message
    });
  }
});

// Get popular searches
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // This would typically come from a search analytics system
    // For now, we'll return some popular tech search terms
    const popularSearches = [
      'gaming laptop',
      'iphone 14',
      'macbook air',
      'samsung galaxy',
      'wireless headphones',
      'gaming mouse',
      'mechanical keyboard',
      'monitor 4k',
      'graphics card',
      'ssd storage'
    ];

    res.json({
      success: true,
      data: popularSearches.slice(0, parseInt(limit))
    });

  } catch (error) {
    console.error('Popular searches error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular searches',
      message: error.message
    });
  }
});

// Get search filters
router.get('/filters', async (req, res) => {
  try {
    const { type, category } = req.query;

    const filters = { status: 'active' };
    if (type) filters.type = type;
    if (category) filters.category = category;

    // Get available brands
    const brands = await Product.distinct('brand', filters);
    
    // Get available price ranges
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

    // Get available use cases
    const useCases = await Product.distinct('useCase', filters);

    // Get available categories
    const categories = await Product.distinct('category', filters);

    // Get available types
    const types = await Product.distinct('type', filters);

    res.json({
      success: true,
      data: {
        brands: brands.sort(),
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 },
        useCases: useCases.sort(),
        categories: categories.sort(),
        types: types.sort()
      }
    });

  } catch (error) {
    console.error('Search filters error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch search filters',
      message: error.message
    });
  }
});

// Advanced search with multiple criteria
router.post('/advanced', async (req, res) => {
  try {
    const {
      query,
      type,
      category,
      brand,
      priceRange,
      useCase,
      rating,
      features,
      sortBy = 'relevance',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.body;

    // Build search criteria
    const searchCriteria = {
      status: 'active'
    };

    // Text search
    if (query) {
      searchCriteria.$text = { $search: query };
    }

    // Type filter
    if (type) {
      searchCriteria.type = type;
    }

    // Category filter
    if (category) {
      searchCriteria.category = category;
    }

    // Brand filter
    if (brand) {
      searchCriteria.brand = new RegExp(brand, 'i');
    }

    // Price range filter
    if (priceRange && (priceRange.min || priceRange.max)) {
      searchCriteria.currentPrice = {};
      if (priceRange.min) searchCriteria.currentPrice.$gte = priceRange.min;
      if (priceRange.max) searchCriteria.currentPrice.$lte = priceRange.max;
    }

    // Use case filter
    if (useCase) {
      searchCriteria.useCase = { $in: Array.isArray(useCase) ? useCase : [useCase] };
    }

    // Rating filter
    if (rating && rating.min) {
      searchCriteria.rating = { $gte: rating.min };
    }

    // Features filter
    if (features && features.length > 0) {
      searchCriteria.tags = { $in: features };
    }

    // Build sort object
    let sort = {};
    if (sortBy === 'relevance' && query) {
      sort = { score: { $meta: 'textScore' } };
    } else if (sortBy === 'price') {
      sort.currentPrice = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'rating') {
      sort.rating = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'newest') {
      sort.createdAt = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search
    const products = await Product.find(searchCriteria, { score: { $meta: 'textScore' } })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(searchCriteria);

    res.json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      },
      criteria: {
        query,
        type,
        category,
        brand,
        priceRange,
        useCase,
        rating,
        features
      }
    });

  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({
      success: false,
      error: 'Advanced search failed',
      message: error.message
    });
  }
});

// Helper function to get search suggestions
async function getSearchSuggestions(query, limit = 10) {
  try {
    // Get product name suggestions
    const productSuggestions = await Product.find({
      name: new RegExp(query, 'i'),
      status: 'active'
    })
    .select('name type category')
    .limit(limit);

    // Get category suggestions
    const categorySuggestions = await Product.distinct('category', {
      category: new RegExp(query, 'i'),
      status: 'active'
    });

    // Get brand suggestions
    const brandSuggestions = await Product.distinct('brand', {
      brand: new RegExp(query, 'i'),
      status: 'active'
    });

    // Get tag suggestions
    const tagSuggestions = await Product.distinct('tags', {
      tags: new RegExp(query, 'i'),
      status: 'active'
    });

    return {
      products: productSuggestions.map(p => ({
        type: 'product',
        text: p.name,
        category: p.category,
        productType: p.type
      })),
      categories: categorySuggestions.map(c => ({
        type: 'category',
        text: c
      })),
      brands: brandSuggestions.map(b => ({
        type: 'brand',
        text: b
      })),
      tags: tagSuggestions.map(t => ({
        type: 'tag',
        text: t
      }))
    };

  } catch (error) {
    console.error('Search suggestions error:', error);
    return {
      products: [],
      categories: [],
      brands: [],
      tags: []
    };
  }
}

export default router;
