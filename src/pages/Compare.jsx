import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApiService } from '../hooks/useApi';

const Compare = () => {
  const [products, setProducts] = useState([]);
  const [priceHistories, setPriceHistories] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { compareProducts } = useApiService();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const productIds = searchParams.get('ids')?.split(',');
    
    if (productIds && productIds.length >= 2) {
      fetchComparisonData(productIds);
    }
  }, [location.search]);

  const fetchComparisonData = async (productIds) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await compareProducts(productIds);
      if (response.success) {
        setProducts(response.data.products);
        setPriceHistories(response.data.priceHistories);
      } else {
        setError(response.error || 'Failed to fetch comparison data');
      }
    } catch (err) {
      setError('Failed to fetch comparison data');
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = (productId) => {
    const updatedProducts = products.filter(p => p._id !== productId);
    if (updatedProducts.length < 2) {
      navigate('/products');
      return;
    }
    
    const updatedIds = updatedProducts.map(p => p._id).join(',');
    navigate(`/compare?ids=${updatedIds}`);
  };

  const addProduct = () => {
    navigate('/products');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getSpecValue = (product, specKey) => {
    return product.specs?.[specKey] || 'N/A';
  };

  const renderSpecRow = (label, specKey) => {
    return (
      <tr className="border-b border-gray-200 dark:border-gray-700">
        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
          {label}
        </td>
        {products.map((product) => (
          <td key={product._id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
            {getSpecValue(product, specKey)}
          </td>
        ))}
      </tr>
    );
  };

  const renderPriceChart = () => {
    if (Object.keys(priceHistories).length === 0) return null;

    const maxPrice = Math.max(...products.map(p => p.currentPrice));
    const minPrice = Math.min(...products.map(p => p.currentPrice));
    const priceRange = maxPrice - minPrice;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Price Comparison</h3>
        <div className="space-y-4">
          {products.map((product) => {
            const pricePercentage = ((product.currentPrice - minPrice) / priceRange) * 100;
            return (
              <div key={product._id} className="flex items-center space-x-4">
                <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {product.name}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                  <div 
                    className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(pricePercentage, 10)}%` }}
                  >
                    <span className="text-white text-xs font-medium">
                      {formatPrice(product.currentPrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (products.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Compare Products</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Select at least 2 products to compare their features and prices
          </p>
          <button 
            onClick={addProduct}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Product Comparison
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={addProduct}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Add Product
              </button>
              <button
                onClick={() => navigate('/products')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Products
              </button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Compare {products.length} products side by side
          </p>
        </div>

        {/* Price Chart */}
        {renderPriceChart()}

        {/* Products Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeProduct(product._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {product.shortDesc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(product.currentPrice)}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detailed Specifications</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Specification
                  </th>
                  {products.map((product) => (
                    <th key={product._id} className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Basic Info */}
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
                    Brand
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {product.brand}
                    </td>
                  ))}
                </tr>
                
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
                    Category
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {product.category}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
                    Price
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      <span className="font-bold text-green-600">
                        {formatPrice(product.currentPrice)}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
                    Rating
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{product.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Technical Specifications */}
                {renderSpecRow('Processor', 'processor')}
                {renderSpecRow('Graphics', 'graphics')}
                {renderSpecRow('Display', 'display')}
                {renderSpecRow('Storage', 'storage')}
                {renderSpecRow('RAM', 'ram')}
                {renderSpecRow('Battery', 'battery')}
                {renderSpecRow('Weight', 'weight')}
                {renderSpecRow('Dimensions', 'dimensions')}
                
                {/* Connectivity */}
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
                    Connectivity
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      <div className="space-y-1">
                        {product.specs?.connectivity?.map((conn, index) => (
                          <span key={index} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded mr-1 mb-1">
                            {conn}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Ports */}
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
                    Ports
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      <div className="space-y-1">
                        {product.specs?.ports?.map((port, index) => (
                          <span key={index} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded mr-1 mb-1">
                            {port}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Use Cases */}
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
                    Use Cases
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      <div className="space-y-1">
                        {product.useCase?.map((useCase, index) => (
                          <span key={index} className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded mr-1 mb-1">
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Investment Advice */}
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
                    Investment Advice
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      <p className="text-sm leading-relaxed">{product.investment}</p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;
