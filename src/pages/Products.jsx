import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, useSearch } from '../hooks/useApi';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

  // Build API parameters
  const apiParams = {
    type: selectedType || undefined,
    category: selectedCategory || undefined,
    sortBy,
    sortOrder,
    page: 1,
    limit: 20
  };

  // Use search API if there's a query, otherwise use products API
  const { data: searchData, loading: searchLoading, error: searchError } = useSearch(
    searchQuery, 
    { type: selectedType, category: selectedCategory }
  );
  
  const { data: productsData, loading: productsLoading, error: productsError } = useProducts(apiParams);

  // Determine which data to use
  const products = searchQuery ? searchData?.data : productsData?.data;
  const loading = searchQuery ? searchLoading : productsLoading;
  const error = searchQuery ? searchError : productsError;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(filterType, value);
    } else {
      newParams.delete(filterType);
    }
    
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedCategory('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Error loading products: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-accent-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          
          {/* Search and Filters */}
          <div className="bg-gray-700 rounded-xl p-6">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-gray-600 text-white rounded-lg px-4 py-3 border border-gray-500 focus:border-accent-blue focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-accent-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  handleFilterChange('type', e.target.value);
                }}
                className="bg-gray-600 text-white rounded-lg px-4 py-3 border border-gray-500 focus:border-accent-blue focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="laptops">Laptops</option>
                <option value="phones">Phones</option>
                <option value="tablets">Tablets</option>
                <option value="earphones">Earphones</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  handleFilterChange('category', e.target.value);
                }}
                className="bg-gray-600 text-white rounded-lg px-4 py-3 border border-gray-500 focus:border-accent-blue focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="gaming">Gaming</option>
                <option value="office">Office</option>
                <option value="budget">Budget</option>
                <option value="premium">Premium</option>
                <option value="creative">Creative</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  handleFilterChange('sortBy', e.target.value);
                }}
                className="bg-gray-600 text-white rounded-lg px-4 py-3 border border-gray-500 focus:border-accent-blue focus:outline-none"
              >
                <option value="createdAt">Newest</option>
                <option value="rating">Rating</option>
                <option value="currentPrice">Price</option>
                <option value="name">Name</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  handleFilterChange('sortOrder', e.target.value);
                }}
                className="bg-gray-600 text-white rounded-lg px-4 py-3 border border-gray-500 focus:border-accent-blue focus:outline-none"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products && products.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-300">
                Showing {products.length} products
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              No products found
            </h3>
            <p className="text-gray-300 mb-8">
              {searchQuery 
                ? `No products match your search for "${searchQuery}"`
                : 'No products available at the moment'
              }
            </p>
            <button
              onClick={clearFilters}
              className="bg-accent-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {searchQuery ? 'Clear search' : 'View all products'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;