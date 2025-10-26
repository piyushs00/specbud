import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

class AmazonService {
  constructor() {
    this.baseUrl = 'https://www.amazon.in';
    this.headers = {
      'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };
  }

  /**
   * Search for products on Amazon
   * @param {string} query - Search query
   * @param {number} limit - Number of results to return
   * @returns {Array} Array of product objects
   */
  async searchProducts(query, limit = 10) {
    try {
      const searchUrl = `${this.baseUrl}/s?k=${encodeURIComponent(query)}&ref=sr_pg_1`;
      
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setUserAgent(this.headers['User-Agent']);
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      
      const products = await page.evaluate(() => {
        const productElements = document.querySelectorAll('[data-component-type="s-search-result"]');
        const results = [];
        
        productElements.forEach((element, index) => {
          if (index >= 10) return; // Limit results
          
          try {
            const titleElement = element.querySelector('h2 a span');
            const priceElement = element.querySelector('.a-price-whole');
            const imageElement = element.querySelector('img');
            const linkElement = element.querySelector('h2 a');
            const ratingElement = element.querySelector('.a-icon-alt');
            const reviewCountElement = element.querySelector('.a-size-base');
            
            if (titleElement && priceElement) {
              const title = titleElement.textContent.trim();
              const price = priceElement.textContent.replace(/[^\d]/g, '');
              const image = imageElement ? imageElement.src : null;
              const link = linkElement ? `https://amazon.in${linkElement.href}` : null;
              const rating = ratingElement ? parseFloat(ratingElement.textContent.split(' ')[0]) : 0;
              const reviewCount = reviewCountElement ? reviewCountElement.textContent.trim() : '0';
              
              // Extract ASIN from URL
              const asinMatch = link ? link.match(/\/dp\/([A-Z0-9]{10})/) : null;
              const asin = asinMatch ? asinMatch[1] : null;
              
              results.push({
                asin,
                title,
                price: parseInt(price) || 0,
                image,
                link,
                rating,
                reviewCount,
                source: 'amazon'
              });
            }
          } catch (error) {
            console.error('Error parsing product element:', error);
          }
        });
        
        return results;
      });
      
      await browser.close();
      return products;
      
    } catch (error) {
      console.error('Amazon search error:', error);
      throw new Error(`Amazon search failed: ${error.message}`);
    }
  }

  /**
   * Get product details by ASIN
   * @param {string} asin - Amazon Standard Identification Number
   * @returns {Object} Product details
   */
  async getProductByASIN(asin) {
    try {
      const productUrl = `${this.baseUrl}/dp/${asin}`;
      
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setUserAgent(this.headers['User-Agent']);
      await page.goto(productUrl, { waitUntil: 'networkidle2' });
      
      const productData = await page.evaluate(() => {
        const getTextContent = (selector) => {
          const element = document.querySelector(selector);
          return element ? element.textContent.trim() : null;
        };
        
        const getAttribute = (selector, attr) => {
          const element = document.querySelector(selector);
          return element ? element.getAttribute(attr) : null;
        };
        
        return {
          title: getTextContent('#productTitle'),
          price: getTextContent('.a-price-whole'),
          image: getAttribute('#landingImage', 'src'),
          rating: getTextContent('.a-icon-alt'),
          reviewCount: getTextContent('#acrCustomerReviewText'),
          availability: getTextContent('#availability span'),
          description: getTextContent('#feature-bullets ul'),
          specifications: getTextContent('#productDetails_techSpec_section_1'),
          brand: getTextContent('#bylineInfo'),
          model: getTextContent('#productDetails_techSpec_section_1 tr:first-child td'),
          features: Array.from(document.querySelectorAll('#feature-bullets ul li span')).map(el => el.textContent.trim())
        };
      });
      
      await browser.close();
      
      // Clean and format the data
      const cleanData = {
        asin,
        title: productData.title,
        price: productData.price ? parseInt(productData.price.replace(/[^\d]/g, '')) : 0,
        image: productData.image,
        rating: productData.rating ? parseFloat(productData.rating.split(' ')[0]) : 0,
        reviewCount: productData.reviewCount ? productData.reviewCount.replace(/[^\d]/g, '') : '0',
        availability: productData.availability,
        brand: productData.brand,
        model: productData.model,
        features: productData.features,
        url: productUrl,
        source: 'amazon',
        lastUpdated: new Date()
      };
      
      return cleanData;
      
    } catch (error) {
      console.error('Amazon product fetch error:', error);
      throw new Error(`Failed to fetch Amazon product: ${error.message}`);
    }
  }

  /**
   * Get current price for a product
   * @param {string} asin - Amazon Standard Identification Number
   * @returns {Object} Price information
   */
  async getCurrentPrice(asin) {
    try {
      const productUrl = `${this.baseUrl}/dp/${asin}`;
      
      const response = await axios.get(productUrl, {
        headers: this.headers,
        timeout: 10000
      });
      
      const $ = cheerio.load(response.data);
      
      const priceText = $('.a-price-whole').first().text();
      const price = priceText ? parseInt(priceText.replace(/[^\d]/g, '')) : 0;
      
      const availability = $('#availability span').first().text().trim();
      const isInStock = !availability.toLowerCase().includes('out of stock');
      
      return {
        asin,
        price,
        availability: isInStock ? 'in_stock' : 'out_of_stock',
        currency: 'INR',
        source: 'amazon',
        url: productUrl,
        lastChecked: new Date()
      };
      
    } catch (error) {
      console.error('Amazon price fetch error:', error);
      throw new Error(`Failed to fetch Amazon price: ${error.message}`);
    }
  }

  /**
   * Get price history for a product (simulated - would need actual price tracking)
   * @param {string} asin - Amazon Standard Identification Number
   * @param {number} days - Number of days to look back
   * @returns {Array} Price history
   */
  async getPriceHistory(asin, days = 30) {
    // This is a placeholder - in a real implementation, you would:
    // 1. Store price data in your database
    // 2. Query historical prices
    // 3. Return formatted price history
    
    const currentPrice = await this.getCurrentPrice(asin);
    
    // Simulate some price history data
    const priceHistory = [];
    const basePrice = currentPrice.price;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate price fluctuations (±10%)
      const variation = (Math.random() - 0.5) * 0.2;
      const price = Math.round(basePrice * (1 + variation));
      
      priceHistory.push({
        date,
        price,
        source: 'amazon',
        asin
      });
    }
    
    return priceHistory;
  }

  /**
   * Compare prices across different sellers
   * @param {string} asin - Amazon Standard Identification Number
   * @returns {Array} Price comparison data
   */
  async comparePrices(asin) {
    try {
      const productUrl = `${this.baseUrl}/dp/${asin}`;
      
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setUserAgent(this.headers['User-Agent']);
      await page.goto(productUrl, { waitUntil: 'networkidle2' });
      
      const priceData = await page.evaluate(() => {
        const sellers = [];
        
        // Main price
        const mainPrice = document.querySelector('.a-price-whole');
        if (mainPrice) {
          sellers.push({
            seller: 'Amazon',
            price: parseInt(mainPrice.textContent.replace(/[^\d]/g, '')),
            type: 'main'
          });
        }
        
        // Other sellers
        const otherSellers = document.querySelectorAll('#olp_feature_div .a-size-base');
        otherSellers.forEach(seller => {
          const priceText = seller.textContent;
          const price = parseInt(priceText.replace(/[^\d]/g, ''));
          if (price > 0) {
            sellers.push({
              seller: 'Other Seller',
              price,
              type: 'alternative'
            });
          }
        });
        
        return sellers;
      });
      
      await browser.close();
      return priceData;
      
    } catch (error) {
      console.error('Amazon price comparison error:', error);
      throw new Error(`Failed to compare Amazon prices: ${error.message}`);
    }
  }
}

export default new AmazonService();
