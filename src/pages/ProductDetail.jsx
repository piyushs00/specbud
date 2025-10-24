import React from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-8">😕</div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="bg-gradient-to-r from-soft-blue to-soft-lilac text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Get category info for styling
  const categoryInfo = {
    phones: { gradient: 'from-pastel-blue to-soft-blue', icon: '📱' },
    laptops: { gradient: 'from-pastel-lilac to-soft-lilac', icon: '💻' },
    tablets: { gradient: 'from-pastel-mint to-soft-mint', icon: '📟' },
    earphones: { gradient: 'from-pastel-peach to-soft-peach', icon: '🎧' }
  };

  const categoryStyle = categoryInfo[product.type] || categoryInfo.phones;

  return (
    <div className="min-h-screen bg-white">
      {/* Header with accent stripe */}
      <div className={`h-2 bg-gradient-to-r ${categoryStyle.gradient}`}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            to="/" 
            className="text-soft-blue hover:text-soft-lilac transition-colors duration-300"
          >
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link 
            to={`/category/${product.type}`} 
            className="text-soft-blue hover:text-soft-lilac transition-colors duration-300"
          >
            {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Image */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-12">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-contain rounded-2xl"
              />
            </div>
            
            {/* Category Badge */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{categoryStyle.icon}</span>
              <span className="text-lg font-semibold text-gray-700 capitalize">
                {product.type}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title and Price */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="text-3xl font-bold text-soft-blue mb-6">
                ₹{product.price.toLocaleString()}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-gradient-to-br from-pastel-blue/20 to-pastel-lilac/20 rounded-3xl p-8">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                Specifications 📋
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-lg font-semibold text-gray-700">Processor</span>
                  <span className="text-lg text-gray-900">{product.specs.processor}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-lg font-semibold text-gray-700">Graphics</span>
                  <span className="text-lg text-gray-900">{product.specs.graphics}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-lg font-semibold text-gray-700">Display</span>
                  <span className="text-lg text-gray-900">{product.specs.display}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-lg font-semibold text-gray-700">Launch Date</span>
                  <span className="text-lg text-gray-900">{product.launched}</span>
                </div>
              </div>
            </div>

            {/* Investment Analysis */}
            <div className="bg-gradient-to-br from-pastel-mint/20 to-pastel-peach/20 rounded-3xl p-8">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                Good Investment? 💡
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {product.investment}
              </p>
            </div>

            {/* Purchase Links */}
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-gray-900">
                Where to Buy 🛒
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.buyLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-soft-blue to-soft-lilac text-white px-6 py-4 rounded-2xl text-center font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
                  >
                    {link.site}
                  </a>
                ))}
              </div>
            </div>

            {/* YouTube Reviews */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900">
                YouTube Reviews 📺
              </h2>
              <div className="space-y-3">
                {product.youtubeReviews.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
                  >
                    <span className="text-2xl">▶️</span>
                    <span className="font-semibold">Review {i + 1}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-8">
              <Link
                to={`/category/${product.type}`}
                className="inline-flex items-center text-xl font-semibold text-soft-blue hover:text-soft-lilac transition-colors duration-300"
              >
                ← Back to {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}