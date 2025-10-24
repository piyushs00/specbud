// Simple in-memory database for development
// This will store data in memory and persist across server restarts

let products = [];
let priceHistory = [];

const SimpleDB = {
  // Product operations
  async createProduct(productData) {
    const product = {
      _id: Date.now().toString(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    products.push(product);
    return product;
  },

  async findProducts(filter = {}) {
    let filteredProducts = [...products];
    
    if (filter.type) {
      filteredProducts = filteredProducts.filter(p => p.type === filter.type);
    }
    
    if (filter.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filter.category);
    }
    
    if (filter.featured !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.featured === filter.featured);
    }
    
    if (filter.trending !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.trending === filter.trending);
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.shortDesc.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredProducts;
  },

  async findProductById(id) {
    return products.find(p => p._id === id);
  },

  async updateProduct(id, updateData) {
    const index = products.findIndex(p => p._id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updateData, updatedAt: new Date() };
      return products[index];
    }
    return null;
  },

  async deleteProduct(id) {
    const index = products.findIndex(p => p._id === id);
    if (index !== -1) {
      return products.splice(index, 1)[0];
    }
    return null;
  },

  // Price history operations
  async createPriceHistory(priceData) {
    const priceEntry = {
      _id: Date.now().toString(),
      ...priceData,
      timestamp: new Date()
    };
    priceHistory.push(priceEntry);
    return priceEntry;
  },

  async findPriceHistory(filter = {}) {
    let filteredHistory = [...priceHistory];
    
    if (filter.productId) {
      filteredHistory = filteredHistory.filter(p => p.productId === filter.productId);
    }
    
    if (filter.days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - filter.days);
      filteredHistory = filteredHistory.filter(p => p.timestamp >= cutoffDate);
    }
    
    return filteredHistory.sort((a, b) => b.timestamp - a.timestamp);
  },

  // Initialize with Amazon products
  async initializeWithAmazonProducts(amazonProducts) {
    products = [];
    priceHistory = [];
    
    for (const productData of amazonProducts) {
      await this.createProduct(productData);
    }
    
    console.log(`✅ Initialized database with ${products.length} Amazon products`);
  },

  // Get statistics
  async getStats() {
    const stats = {
      totalProducts: products.length,
      laptops: products.filter(p => p.type === 'laptops').length,
      phones: products.filter(p => p.type === 'phones').length,
      earphones: products.filter(p => p.type === 'earphones').length,
      premium: products.filter(p => p.category === 'premium').length,
      gaming: products.filter(p => p.category === 'gaming').length,
      budget: products.filter(p => p.category === 'budget').length,
      totalPriceHistory: priceHistory.length
    };
    
    return stats;
  }
};

module.exports = SimpleDB;
