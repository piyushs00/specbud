import { useState, useEffect } from 'react';
import apiService from '../services/api';

// Custom hook for API calls with loading states
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Specific hooks for common API calls
export const useProducts = (params = {}) => {
  return useApi(() => apiService.getProducts(params), [JSON.stringify(params)]);
};

export const useProduct = (id) => {
  return useApi(() => apiService.getProduct(id), [id]);
};

export const useTrendingProducts = (limit = 10) => {
  return useApi(() => apiService.getTrendingProducts(limit), [limit]);
};

export const useFeaturedProducts = (limit = 10) => {
  return useApi(() => apiService.getFeaturedProducts(limit), [limit]);
};

export const useSearch = (query, params = {}) => {
  return useApi(() => apiService.searchProducts(query, params), [query, JSON.stringify(params)]);
};

export const useCategories = () => {
  return useApi(() => apiService.getCategories());
};

export const useCategoryProducts = (category, params = {}) => {
  return useApi(() => apiService.getCategoryProducts(category, params), [category, JSON.stringify(params)]);
};

export const usePriceHistory = (productId, days = 30) => {
  return useApi(() => apiService.getPriceHistory(productId, days), [productId, days]);
};

export const usePriceTrends = (productId, days = 30) => {
  return useApi(() => apiService.getPriceTrends(productId, days), [productId, days]);
};

export const useBestDeals = (limit = 10, minDiscount = 10) => {
  return useApi(() => apiService.getBestDeals(limit, minDiscount), [limit, minDiscount]);
};

export const useRecentPriceDrops = (limit = 10, hours = 24) => {
  return useApi(() => apiService.getRecentPriceDrops(limit, hours), [limit, hours]);
};

export const usePriceComparison = (productId) => {
  return useApi(() => apiService.comparePrices(productId), [productId]);
};

export const useSearchSuggestions = (query, limit = 10) => {
  return useApi(() => apiService.getSearchSuggestions(query, limit), [query, limit]);
};

export const usePopularSearches = (limit = 10) => {
  return useApi(() => apiService.getPopularSearches(limit), [limit]);
};

export const useCurrentPrices = (productIds) => {
  return useApi(() => apiService.getCurrentPrices(productIds), [JSON.stringify(productIds)]);
};

export const useHealth = () => {
  return useApi(() => apiService.getHealth());
};

// Hook for product comparison
export const useCompareProducts = (productIds) => {
  return useApi(() => apiService.compareProducts(productIds), [JSON.stringify(productIds)]);
};

// Main useApi hook with comparison functionality
export const useApi = () => {
  return {
    // Existing methods
    getProducts: apiService.getProducts,
    getProduct: apiService.getProduct,
    getTrendingProducts: apiService.getTrendingProducts,
    getFeaturedProducts: apiService.getFeaturedProducts,
    searchProducts: apiService.searchProducts,
    getCategories: apiService.getCategories,
    getCategoryProducts: apiService.getCategoryProducts,
    getPriceHistory: apiService.getPriceHistory,
    getPriceTrends: apiService.getPriceTrends,
    getBestDeals: apiService.getBestDeals,
    getRecentPriceDrops: apiService.getRecentPriceDrops,
    comparePrices: apiService.comparePrices,
    getSearchSuggestions: apiService.getSearchSuggestions,
    getPopularSearches: apiService.getPopularSearches,
    getCurrentPrices: apiService.getCurrentPrices,
    getHealth: apiService.getHealth,
    
    // New comparison method
    compareProducts: apiService.compareProducts
  };
};