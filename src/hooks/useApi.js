import { useApi } from "./useApiCore";
import apiService from "../services/api";

// Specific hooks for common API calls
export const useProducts = (params = {}) => useApi(() => apiService.getProducts(params), [JSON.stringify(params)]);
export const useProduct = (id) => useApi(() => apiService.getProduct(id), [id]);
export const useTrendingProducts = (limit = 10) => useApi(() => apiService.getTrendingProducts(limit), [limit]);
export const useFeaturedProducts = (limit = 10) => useApi(() => apiService.getFeaturedProducts(limit), [limit]);
export const useSearch = (query, params = {}) => useApi(() => apiService.searchProducts(query, params), [query, JSON.stringify(params)]);
export const useCategories = () => useApi(() => apiService.getCategories());
export const useCategoryProducts = (category, params = {}) => useApi(() => apiService.getCategoryProducts(category, params), [category, JSON.stringify(params)]);
export const usePriceHistory = (productId, days = 30) => useApi(() => apiService.getPriceHistory(productId, days), [productId, days]);
export const usePriceTrends = (productId, days = 30) => useApi(() => apiService.getPriceTrends(productId, days), [productId, days]);
export const useBestDeals = (limit = 10, minDiscount = 10) => useApi(() => apiService.getBestDeals(limit, minDiscount), [limit, minDiscount]);
export const useRecentPriceDrops = (limit = 10, hours = 24) => useApi(() => apiService.getRecentPriceDrops(limit, hours), [limit, hours]);
export const usePriceComparison = (productId) => useApi(() => apiService.comparePrices(productId), [productId]);
export const useSearchSuggestions = (query, limit = 10) => useApi(() => apiService.getSearchSuggestions(query, limit), [query, limit]);
export const usePopularSearches = (limit = 10) => useApi(() => apiService.getPopularSearches(limit), [limit]);
export const useCurrentPrices = (productIds) => useApi(() => apiService.getCurrentPrices(productIds), [JSON.stringify(productIds)]);
export const useHealth = () => useApi(() => apiService.getHealth());
export const useCompareProducts = (productIds) => useApi(() => apiService.compareProducts(productIds), [JSON.stringify(productIds)]);

// API service hook for direct method access
export const useApiService = () => ({
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
  getHealth: apiService.getHealth(),
  compareProducts: apiService.compareProducts
});
