import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../services/api";

export default function ProductCard({ product }) {
  const [livePrice, setLivePrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [comparisonProducts, setComparisonProducts] = useState([]);
  const navigate = useNavigate();

  // Get category styling
  const categoryInfo = {
    phones: { gradient: 'from-pastel-blue to-soft-blue', icon: '📱' },
    laptops: { gradient: 'from-pastel-lilac to-soft-lilac', icon: '💻' },
    tablets: { gradient: 'from-pastel-mint to-soft-mint', icon: '📟' },
    earphones: { gradient: 'from-pastel-peach to-soft-peach', icon: '🎧' }
  };

  const categoryStyle = categoryInfo[product.type] || categoryInfo.phones;

  // Fetch live price when component mounts
  useEffect(() => {
    const fetchLivePrice = async () => {
      if (product._id || product.id) {
        setPriceLoading(true);
        try {
          const productId = product._id || product.id;
          const data = await apiService.getCurrentPrices([productId]);
          if (data.success && data.data && data.data.length > 0) {
            setLivePrice(data.data[0]);
            setLastUpdated(new Date());
          }
        } catch (error) {
          console.error('Error fetching live price:', error);
        } finally {
          setPriceLoading(false);
        }
      }
    };

    fetchLivePrice();
    
    // Set up interval to refresh prices every 5 minutes
    const interval = setInterval(fetchLivePrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [product._id, product.id]);

  // Load comparison products from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('comparisonProducts');
    if (saved) {
      setComparisonProducts(JSON.parse(saved));
    }
  }, []);

  // Add to comparison
  const addToComparison = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productId = product._id || product.id;
    const updatedComparison = [...comparisonProducts];
    
    if (!updatedComparison.includes(productId)) {
      if (updatedComparison.length >= 4) {
        alert('You can compare up to 4 products at once');
        return;
      }
      updatedComparison.push(productId);
    }
    
    setComparisonProducts(updatedComparison);
    localStorage.setItem('comparisonProducts', JSON.stringify(updatedComparison));
    
    // Navigate to comparison if we have 2 or more products
    if (updatedComparison.length >= 2) {
      navigate(`/compare?ids=${updatedComparison.join(',')}`);
    }
  };

  // Calculate price difference
  const currentPrice = livePrice?.currentPrice || product.currentPrice || product.price;
  const basePrice = product.basePrice || product.price;
  const priceDifference = basePrice - currentPrice;
  const discountPercentage = basePrice > 0 ? Math.round((priceDifference / basePrice) * 100) : 0;
  
  const productId = product._id || product.id;
  const isInComparison = comparisonProducts.includes(productId);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
    >
      <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 transform overflow-hidden">
        {/* Product Image */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        {/* Product Info */}
        <div className="p-6 lg:p-8">
          {/* Category Badge */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">{categoryStyle.icon}</span>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              {product.type}
            </span>
          </div>
          
          {/* Product Name */}
          <h3 className="text-xl lg:text-2xl font-display font-bold text-gray-900 mb-3 group-hover:text-soft-blue transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-lg mb-4 leading-relaxed">
            {product.shortDesc}
          </p>
          
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl font-bold text-soft-blue">
                ₹{currentPrice.toLocaleString()}
              </span>
              {priceLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-soft-blue"></div>
              )}
            </div>
            
            {/* Price difference and discount */}
            {priceDifference > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 line-through">
                  ₹{basePrice.toLocaleString()}
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                  -{discountPercentage}%
                </span>
                <span className="text-green-600 text-sm font-medium">
                  Save ₹{priceDifference.toLocaleString()}
                </span>
              </div>
            )}
            
            {/* Live price indicator */}
            {livePrice && lastUpdated && (
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">
                  Live price • Updated {Math.round((Date.now() - lastUpdated.getTime()) / 60000)}m ago
                </span>
              </div>
            )}
          </div>
          
          {/* Key Specs */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Processor</span>
              <span className="text-gray-900 font-medium">{product.specs.processor}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Display</span>
              <span className="text-gray-900 font-medium">{product.specs.display}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Compare Button */}
            <button
              onClick={addToComparison}
              className={`w-full px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isInComparison
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isInComparison ? '✓ Added to Compare' : '📊 Add to Compare'}
            </button>
            
            {/* View Details Button */}
            <div className={`bg-gradient-to-r ${categoryStyle.gradient} text-white px-6 py-3 rounded-2xl text-center font-semibold group-hover:shadow-lg transition-all duration-300`}>
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
