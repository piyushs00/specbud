import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  // Get category styling
  const categoryInfo = {
    phones: { gradient: 'from-pastel-blue to-soft-blue', icon: '📱' },
    laptops: { gradient: 'from-pastel-lilac to-soft-lilac', icon: '💻' },
    tablets: { gradient: 'from-pastel-mint to-soft-mint', icon: '📟' },
    earphones: { gradient: 'from-pastel-peach to-soft-peach', icon: '🎧' }
  };

  const categoryStyle = categoryInfo[product.type] || categoryInfo.phones;

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
          <div className="text-2xl font-bold text-soft-blue mb-6">
            ₹{(product.currentPrice || product.price).toLocaleString()}
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
          
          {/* View Details Button */}
          <div className={`bg-gradient-to-r ${categoryStyle.gradient} text-white px-6 py-3 rounded-2xl text-center font-semibold group-hover:shadow-lg transition-all duration-300`}>
            View Details →
          </div>
        </div>
      </div>
    </Link>
  );
}
