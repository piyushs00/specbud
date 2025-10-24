import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Category() {
  const { type } = useParams();
  const [formData, setFormData] = useState({
    budget: 50000,
    usageHours: 8,
    purpose: 'Office',
    environment: 'Home'
  });
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Filter products by type
  const filteredProducts = products.filter((p) => p.type === type);
  
  // Get category info
  const categoryInfo = {
    phones: { name: 'Phones', icon: '📱', gradient: 'from-pastel-blue to-soft-blue' },
    laptops: { name: 'Laptops', icon: '💻', gradient: 'from-pastel-lilac to-soft-lilac' },
    tablets: { name: 'Tablets', icon: '📟', gradient: 'from-pastel-mint to-soft-mint' },
    earphones: { name: 'Earphones', icon: '🎧', gradient: 'from-pastel-peach to-soft-peach' }
  };

  const currentCategory = categoryInfo[type] || { name: type, icon: '📱', gradient: 'from-pastel-blue to-soft-blue' };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' || name === 'usageHours' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowRecommendations(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className={`bg-gradient-to-br ${currentCategory.gradient} py-20 lg:py-32`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-8xl lg:text-9xl mb-8 animate-bounce-gentle">
            {currentCategory.icon}
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-6">
            {currentCategory.name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Tell us about your needs and we'll find the perfect {currentCategory.name.toLowerCase()} for you
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-pastel-blue/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <h2 className="text-4xl font-display font-bold text-center text-gray-900 mb-12">
              Let's Find Your Perfect Match 🎯
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Budget */}
              <div className="space-y-4">
                <label className="block text-xl font-semibold text-gray-800">
                  Budget Range 💰
                </label>
                <div className="relative">
                  <input
                    type="range"
                    name="budget"
                    min="10000"
                    max="200000"
                    step="5000"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full h-3 bg-gradient-to-r from-soft-blue to-soft-lilac rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>₹10K</span>
                    <span className="text-2xl font-bold text-soft-blue">₹{formData.budget.toLocaleString()}</span>
                    <span>₹2L</span>
                  </div>
                </div>
              </div>

              {/* Daily Usage Hours */}
              <div className="space-y-4">
                <label className="block text-xl font-semibold text-gray-800">
                  Daily Usage Hours ⏰
                </label>
                <input
                  type="number"
                  name="usageHours"
                  min="1"
                  max="24"
                  value={formData.usageHours}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-soft-blue focus:ring-4 focus:ring-soft-blue/20 transition-all duration-300"
                  placeholder="How many hours per day?"
                />
              </div>

              {/* Main Purpose */}
              <div className="space-y-4">
                <label className="block text-xl font-semibold text-gray-800">
                  Main Purpose 🎯
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-soft-blue focus:ring-4 focus:ring-soft-blue/20 transition-all duration-300"
                >
                  <option value="Gaming">🎮 Gaming</option>
                  <option value="Coding">💻 Coding</option>
                  <option value="Office">🏢 Office Work</option>
                  <option value="Study">📚 Study</option>
                  <option value="Multimedia">🎬 Multimedia</option>
                </select>
              </div>

              {/* Environment */}
              <div className="space-y-4">
                <label className="block text-xl font-semibold text-gray-800">
                  Environment 🏠
                </label>
                <select
                  name="environment"
                  value={formData.environment}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-soft-blue focus:ring-4 focus:ring-soft-blue/20 transition-all duration-300"
                >
                  <option value="Home">🏠 Home</option>
                  <option value="Office">🏢 Office</option>
                  <option value="Classroom">🎓 Classroom</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-8">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-soft-blue to-soft-lilac text-white px-16 py-6 rounded-full text-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
                >
                  Get Recommendations ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      {showRecommendations && (
        <section className="py-20 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-8">
                Perfect Matches for You 🎯
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Based on your preferences, here are our top recommendations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {filteredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Link
                to="/"
                className="inline-flex items-center text-xl font-semibold text-soft-blue hover:text-soft-lilac transition-colors duration-300"
              >
                ← Back to Categories
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* All Products Section (if no recommendations shown) */}
      {!showRecommendations && (
        <section className="py-20 lg:py-32 bg-gradient-to-b from-pastel-blue/10 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-8">
                Browse All {currentCategory.name}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore our complete collection of {currentCategory.name.toLowerCase()}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #BBDEFB, #E1BEE7);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #BBDEFB, #E1BEE7);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}