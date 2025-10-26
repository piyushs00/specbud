import cron from 'node-cron';
import Product from '../models/Product.js';
import PriceHistory from '../models/PriceHistory.js';
import amazonService from './amazonService.js';

class PriceTracker {
  constructor() {
    this.isRunning = false;
    this.updateInterval = process.env.PRICE_UPDATE_INTERVAL || 60; // minutes
  }

  /**
   * Start the price tracking service
   */
  start() {
    if (this.isRunning) {
      console.log('Price tracker is already running');
      return;
    }

    console.log(`🔄 Starting price tracker (updates every ${this.updateInterval} minutes)`);
    
    // Run immediately on start
    this.updateAllPrices();
    
    // Schedule regular updates
    cron.schedule(`*/${this.updateInterval} * * * *`, () => {
      console.log('🔄 Running scheduled price update...');
      this.updateAllPrices();
    });

    this.isRunning = true;
  }

  /**
   * Stop the price tracking service
   */
  stop() {
    this.isRunning = false;
    console.log('⏹️ Price tracker stopped');
  }

  /**
   * Update prices for all products
   */
  async updateAllPrices() {
    try {
      console.log('🔄 Starting price update for all products...');
      
      const products = await Product.find({ status: 'active' }).limit(50); // Limit to avoid overwhelming
      let updatedCount = 0;
      let errorCount = 0;

      for (const product of products) {
        try {
          await this.updateProductPrice(product);
          updatedCount++;
          
          // Add delay between requests to avoid rate limiting
          await this.delay(1000);
        } catch (error) {
          console.error(`❌ Failed to update price for product ${product.name}:`, error.message);
          errorCount++;
        }
      }

      console.log(`✅ Price update completed: ${updatedCount} updated, ${errorCount} errors`);
    } catch (error) {
      console.error('❌ Price update failed:', error);
    }
  }

  /**
   * Update price for a specific product
   * @param {Object} product - Product document
   */
  async updateProductPrice(product) {
    try {
      let newPrice = product.currentPrice;
      let source = 'manual';
      let availability = 'in_stock';

      // Try to get price from Amazon if ASIN is available
      if (product.amazonASIN) {
        try {
          const amazonPrice = await amazonService.getCurrentPrice(product.amazonASIN);
          if (amazonPrice && amazonPrice.price > 0) {
            newPrice = amazonPrice.price;
            source = 'amazon';
            availability = amazonPrice.availability;
          }
        } catch (error) {
          console.warn(`⚠️ Amazon price fetch failed for ${product.name}:`, error.message);
        }
      }

      // Try to get price from other buy links
      if (newPrice === product.currentPrice) {
        for (const buyLink of product.buyLinks) {
          try {
            const linkPrice = await this.scrapePriceFromUrl(buyLink.url);
            if (linkPrice && linkPrice > 0) {
              newPrice = linkPrice;
              source = buyLink.site;
              break;
            }
          } catch (error) {
            console.warn(`⚠️ Price fetch failed for ${buyLink.site}:`, error.message);
          }
        }
      }

      // Only update if price has changed
      if (newPrice !== product.currentPrice) {
        // Store price history
        await this.storePriceHistory(product._id, newPrice, source, availability);
        
        // Update product price
        await product.updatePrice(newPrice, source);
        
        console.log(`💰 Updated ${product.name}: ₹${product.currentPrice} → ₹${newPrice} (${source})`);
      } else {
        console.log(`📊 No price change for ${product.name}`);
      }

    } catch (error) {
      throw new Error(`Price update failed: ${error.message}`);
    }
  }

  /**
   * Store price history entry
   * @param {string} productId - Product ID
   * @param {number} price - Price value
   * @param {string} source - Price source
   * @param {string} availability - Product availability
   */
  async storePriceHistory(productId, price, source, availability = 'in_stock') {
    try {
      const priceEntry = new PriceHistory({
        productId,
        price,
        source,
        availability,
        url: this.getSourceUrl(source),
        timestamp: new Date()
      });

      await priceEntry.save();
    } catch (error) {
      console.error('❌ Failed to store price history:', error);
    }
  }

  /**
   * Scrape price from a URL (basic implementation)
   * @param {string} url - URL to scrape
   * @returns {number} Price value
   */
  async scrapePriceFromUrl(url) {
    try {
      const axios = require('axios');
      const cheerio = require('cheerio');
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Common price selectors for different sites
      const priceSelectors = [
        '.price',
        '.product-price',
        '.current-price',
        '.selling-price',
        '[data-testid="price"]',
        '.a-price-whole',
        '.price-current'
      ];

      for (const selector of priceSelectors) {
        const priceText = $(selector).first().text();
        if (priceText) {
          const price = parseInt(priceText.replace(/[^\d]/g, ''));
          if (price > 0) {
            return price;
          }
        }
      }

      return null;
    } catch (error) {
      console.warn(`⚠️ Price scraping failed for ${url}:`, error.message);
      return null;
    }
  }

  /**
   * Get source URL for price history
   * @param {string} source - Source name
   * @returns {string} Source URL
   */
  getSourceUrl(source) {
    const sourceUrls = {
      'amazon': 'https://amazon.in',
      'flipkart': 'https://flipkart.com',
      'reliance_digital': 'https://reliancedigital.in',
      'croma': 'https://croma.com'
    };

    return sourceUrls[source] || source;
  }

  /**
   * Get price trends for a product
   * @param {string} productId - Product ID
   * @param {number} days - Number of days to analyze
   * @returns {Object} Price trend data
   */
  async getPriceTrends(productId, days = 30) {
    try {
      const priceHistory = await PriceHistory.getPriceTrend(productId, days);
      const stats = await PriceHistory.getPriceStats(productId, days);
      const lowestPrice = await PriceHistory.getLowestPrice(productId, days);

      return {
        history: priceHistory,
        statistics: stats[0] || null,
        lowestPrice: lowestPrice,
        trend: this.calculateTrend(priceHistory)
      };
    } catch (error) {
      throw new Error(`Failed to get price trends: ${error.message}`);
    }
  }

  /**
   * Calculate price trend
   * @param {Array} priceHistory - Array of price history entries
   * @returns {string} Trend direction
   */
  calculateTrend(priceHistory) {
    if (priceHistory.length < 2) return 'stable';

    const firstPrice = priceHistory[0].price;
    const lastPrice = priceHistory[priceHistory.length - 1].price;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;

    if (change > 5) return 'increasing';
    if (change < -5) return 'decreasing';
    return 'stable';
  }

  /**
   * Utility function to add delay
   * @param {number} ms - Milliseconds to delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get price alerts for products with significant price changes
   * @param {number} threshold - Price change threshold percentage
   * @returns {Array} Array of price alerts
   */
  async getPriceAlerts(threshold = 10) {
    try {
      const products = await Product.find({ status: 'active' });
      const alerts = [];

      for (const product of products) {
        const priceHistory = await PriceHistory.getPriceTrend(product._id, 7); // Last 7 days
        
        if (priceHistory.length >= 2) {
          const firstPrice = priceHistory[0].price;
          const lastPrice = priceHistory[priceHistory.length - 1].price;
          const change = ((lastPrice - firstPrice) / firstPrice) * 100;

          if (Math.abs(change) >= threshold) {
            alerts.push({
              productId: product._id,
              productName: product.name,
              oldPrice: firstPrice,
              newPrice: lastPrice,
              change: change,
              type: change > 0 ? 'increase' : 'decrease',
              timestamp: new Date()
            });
          }
        }
      }

      return alerts;
    } catch (error) {
      throw new Error(`Failed to get price alerts: ${error.message}`);
    }
  }
}

export default new PriceTracker();
