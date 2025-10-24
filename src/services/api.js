const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // Generic fetch method
  async fetchData(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Products API
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetchData(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id) {
    return this.fetchData(`/products/${id}`);
  }

  async getTrendingProducts(limit = 10) {
    return this.fetchData(`/products/trending/items?limit=${limit}`);
  }

  async getFeaturedProducts(limit = 10) {
    return this.fetchData(`/products/featured/items?limit=${limit}`);
  }

  async getProductsByCategory(category, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetchData(`/products/category/${category}${queryString ? `?${queryString}` : ''}`);
  }

  async getProductRecommendations(id) {
    return this.fetchData(`/products/${id}/recommendations`);
  }

  // Search API
  async searchProducts(query, params = {}) {
    const searchParams = { q: query, ...params };
    const queryString = new URLSearchParams(searchParams).toString();
    return this.fetchData(`/search?${queryString}`);
  }

  async getSearchSuggestions(query, limit = 10) {
    return this.fetchData(`/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getPopularSearches(limit = 10) {
    return this.fetchData(`/search/popular?limit=${limit}`);
  }

  // Categories API
  async getCategories() {
    return this.fetchData('/categories');
  }

  async getCategoryProducts(category, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetchData(`/categories/${category}/products${queryString ? `?${queryString}` : ''}`);
  }

  async getCategoryStats(category) {
    return this.fetchData(`/categories/${category}/stats`);
  }

  async getCategoryFilters(category) {
    return this.fetchData(`/categories/${category}/filters`);
  }

  async getTrendingInCategory(category, limit = 10) {
    return this.fetchData(`/categories/${category}/trending?limit=${limit}`);
  }

  async getDealsInCategory(category, limit = 10, minDiscount = 10) {
    return this.fetchData(`/categories/${category}/deals?limit=${limit}&minDiscount=${minDiscount}`);
  }

  // Prices API
  async getCurrentPrices(productIds) {
    const ids = Array.isArray(productIds) ? productIds.join(',') : productIds;
    return this.fetchData(`/prices/current?productIds=${ids}`);
  }

  async getPriceHistory(productId, days = 30) {
    return this.fetchData(`/prices/history/${productId}?days=${days}`);
  }

  async getPriceTrends(productId, days = 30) {
    return this.fetchData(`/prices/trends/${productId}?days=${days}`);
  }

  async getPriceAlerts(threshold = 10) {
    return this.fetchData(`/prices/alerts?threshold=${threshold}`);
  }

  async getBestDeals(limit = 10, minDiscount = 10) {
    return this.fetchData(`/prices/deals/best?limit=${limit}&minDiscount=${minDiscount}`);
  }

  async getRecentPriceDrops(limit = 10, hours = 24) {
    return this.fetchData(`/prices/drops/recent?limit=${limit}&hours=${hours}`);
  }

  async comparePrices(productId) {
    return this.fetchData(`/prices/compare/${productId}`);
  }

  async getPriceStats(productId, days = 30) {
    return this.fetchData(`/prices/stats/${productId}?days=${days}`);
  }

  // Health check
  async getHealth() {
    return this.fetchData('/health', { baseURL: 'http://localhost:5000' });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

