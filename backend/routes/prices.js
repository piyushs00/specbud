import express from 'express';
import Product from '../models/Product.js';
import PriceHistory from '../models/PriceHistory.js';

const router = express.Router();
import amazonService from '../services/amazonService.js';
import priceTracker from '../services/priceTracker.js';

// Get current prices for multiple products
router.get('/current', async (req, res) => {
  try {
    const { productIds } = req.query;
    
    if (!productIds) {
      return res.status(400).json({
        success: false,
        error: 'Product IDs are required'
      });
    }

    const ids = productIds.split(',');
    const products = await Product.find({
      _id: { $in: ids },
      status: 'active'
    }).select('name currentPrice basePrice currency lastPriceUpdate');

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Current prices fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch current prices',
      message: error.message
    });
  }
});

// Get price history for a product
router.get('/history/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { days = 30, source } = req.query;

    const filters = {
      productId,
      timestamp: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
    };

    if (source) {
      filters.source = source;
    }

    const priceHistory = await PriceHistory.find(filters)
      .sort({ timestamp: -1 })
      .limit(100);

    // Get price statistics
    const stats = await PriceHistory.getPriceStats(productId, parseInt(days));
    const lowestPrice = await PriceHistory.getLowestPrice(productId, parseInt(days));

    res.json({
      success: true,
      data: {
        history: priceHistory,
        statistics: stats[0] || null,
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

// Get price trends
router.get('/trends/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { days = 30 } = req.query;

    const trends = await priceTracker.getPriceTrends(productId, parseInt(days));

    res.json({
      success: true,
      data: trends
    });

  } catch (error) {
    console.error('Price trends fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch price trends',
      message: error.message
    });
  }
});

// Get price alerts
router.get('/alerts', async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const alerts = await priceTracker.getPriceAlerts(parseInt(threshold));

    res.json({
      success: true,
      data: alerts
    });

  } catch (error) {
    console.error('Price alerts fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch price alerts',
      message: error.message
    });
  }
});

// Update price for a specific product
router.post('/update/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { source = 'manual' } = req.body;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Update price using price tracker
    await priceTracker.updateProductPrice(product);

    // Get updated product with price history
    const updatedProduct = await Product.findById(productId);
    const priceHistory = await PriceHistory.getPriceTrend(productId, 7);

    res.json({
      success: true,
      data: {
        product: updatedProduct,
        recentHistory: priceHistory
      },
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

// Get Amazon price for a product
router.get('/amazon/:asin', async (req, res) => {
  try {
    const { asin } = req.params;

    const amazonPrice = await amazonService.getCurrentPrice(asin);

    res.json({
      success: true,
      data: amazonPrice
    });

  } catch (error) {
    console.error('Amazon price fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Amazon price',
      message: error.message
    });
  }
});

// Compare prices across sources
router.get('/compare/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const priceComparison = [];

    // Get current price from database
    priceComparison.push({
      source: 'database',
      price: product.currentPrice,
      currency: product.currency,
      lastUpdated: product.lastPriceUpdate
    });

    // Get Amazon price if ASIN is available
    if (product.amazonASIN) {
      try {
        const amazonPrice = await amazonService.getCurrentPrice(product.amazonASIN);
        priceComparison.push({
          source: 'amazon',
          price: amazonPrice.price,
          currency: amazonPrice.currency,
          availability: amazonPrice.availability,
          url: amazonPrice.url,
          lastUpdated: amazonPrice.lastChecked
        });
      } catch (error) {
        console.warn('Amazon price fetch failed:', error.message);
      }
    }

    // Get prices from buy links
    for (const buyLink of product.buyLinks) {
      if (buyLink.price && buyLink.price > 0) {
        priceComparison.push({
          source: buyLink.site,
          price: buyLink.price,
          currency: product.currency,
          availability: buyLink.availability,
          url: buyLink.url,
          lastUpdated: buyLink.lastChecked
        });
      }
    }

    // Sort by price
    priceComparison.sort((a, b) => a.price - b.price);

    res.json({
      success: true,
      data: {
        product: {
          id: product._id,
          name: product.name,
          image: product.image
        },
        priceComparison
      }
    });

  } catch (error) {
    console.error('Price comparison error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare prices',
      message: error.message
    });
  }
});

// Get price statistics
router.get('/stats/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { days = 30 } = req.query;

    const stats = await PriceHistory.getPriceStats(productId, parseInt(days));
    const lowestPrice = await PriceHistory.getLowestPrice(productId, parseInt(days));
    const priceHistory = await PriceHistory.getPriceTrend(productId, parseInt(days));

    // Calculate additional statistics
    const prices = priceHistory.map(entry => entry.price);
    const priceChanges = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = ((prices[i] - prices[i-1]) / prices[i-1]) * 100;
      priceChanges.push(change);
    }

    const averageChange = priceChanges.length > 0 
      ? priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length 
      : 0;

    const volatility = priceChanges.length > 0
      ? Math.sqrt(priceChanges.reduce((sum, change) => sum + Math.pow(change - averageChange, 2), 0) / priceChanges.length)
      : 0;

    res.json({
      success: true,
      data: {
        statistics: stats[0] || null,
        lowestPrice,
        averageChange: Math.round(averageChange * 100) / 100,
        volatility: Math.round(volatility * 100) / 100,
        priceChanges: priceChanges.length,
        days: parseInt(days)
      }
    });

  } catch (error) {
    console.error('Price statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch price statistics',
      message: error.message
    });
  }
});

// Get best deals
router.get('/deals/best', async (req, res) => {
  try {
    const { limit = 10, minDiscount = 10 } = req.query;

    const products = await Product.find({
      status: 'active',
      $expr: { $lt: ['$currentPrice', '$basePrice'] }
    })
    .sort({ discountPercentage: -1 })
    .limit(parseInt(limit));

    // Filter by minimum discount
    const deals = products.filter(product => {
      const discount = ((product.basePrice - product.currentPrice) / product.basePrice) * 100;
      return discount >= parseInt(minDiscount);
    });

    res.json({
      success: true,
      data: deals
    });

  } catch (error) {
    console.error('Best deals fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch best deals',
      message: error.message
    });
  }
});

// Get price drops
router.get('/drops/recent', async (req, res) => {
  try {
    const { limit = 10, hours = 24 } = req.query;

    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const priceDrops = await PriceHistory.aggregate([
      {
        $match: {
          timestamp: { $gte: cutoffTime }
        }
      },
      {
        $group: {
          _id: '$productId',
          latestPrice: { $first: '$price' },
          previousPrice: { $last: '$price' },
          priceDrop: { $subtract: ['$previousPrice', '$latestPrice'] },
          dropPercentage: {
            $multiply: [
              { $divide: [{ $subtract: ['$previousPrice', '$latestPrice'] }, '$previousPrice'] },
              100
            ]
          },
          source: { $first: '$source' },
          timestamp: { $first: '$timestamp' }
        }
      },
      {
        $match: {
          priceDrop: { $gt: 0 }
        }
      },
      {
        $sort: { priceDrop: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      }
    ]);

    res.json({
      success: true,
      data: priceDrops
    });

  } catch (error) {
    console.error('Price drops fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch price drops',
      message: error.message
    });
  }
});

export default router;
