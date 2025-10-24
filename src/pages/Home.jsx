import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useTrendingProducts, useFeaturedProducts, useCategories } from '../hooks/useApi';
import ApiTest from '../components/ApiTest';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedUseCase, setSelectedUseCase] = useState('');
  const navigate = useNavigate();

  // API hooks for backend data
  const { data: trendingData } = useTrendingProducts(4);
  const { data: featuredData } = useFeaturedProducts(4);
  const { data: categoriesData } = useCategories();

  const categories = [
    { id: 'gaming', name: 'Best for Gaming', icon: '🎮', color: 'bg-blue-500', description: 'High-performance gaming laptops and desktops' },
    { id: 'office', name: 'Best for Office', icon: '💼', color: 'bg-green-500', description: 'Professional productivity machines' },
    { id: 'budget', name: 'Best Budget', icon: '💰', color: 'bg-yellow-500', description: 'Great value for money options' },
    { id: 'premium', name: 'Best Premium', icon: '👑', color: 'bg-purple-500', description: 'Top-tier luxury devices' },
  ];

  const features = [
    {
      title: 'AI-Powered Matching',
      description: 'Our intelligent system analyzes your needs and recommends the perfect tech products for you.',
      icon: '🧠',
      gradient: 'from-accent-purple to-purple-600'
    },
    {
      title: 'Smart Comparisons',
      description: 'Compare products side-by-side with detailed specs and real-world performance data.',
      icon: '⚖️',
      gradient: 'from-accent-green to-green-600'
    },
    {
      title: 'Best Deal Finder',
      description: 'We track prices across all major retailers to ensure you get the best deals available.',
      icon: '🏷️',
      gradient: 'from-accent-orange to-orange-600'
    }
  ];

  // Use backend data if available, fallback to local data
  const trendingProducts = trendingData?.data || products.slice(0, 4).map((product, index) => ({
    ...product,
    badge: index === 0 ? 'Worth It!' : index === 1 ? 'Hot Deal' : index === 2 ? 'New' : 'Editor\'s Pick',
    badgeColor: index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : index === 2 ? 'bg-green-500' : 'bg-orange-500',
    rating: index === 0 ? 4 : index === 1 ? 5 : index === 2 ? 4 : 5
  }));

  // Use backend categories if available, fallback to local categories
  const displayCategories = categoriesData?.data || categories;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-blue via-gray-900 to-dark-green"></div>

        {/* Animated Humanoid Bot Background (left, friendly thumbs-up) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-start">
          <div className="relative w-[500px] h-[640px] opacity-80 animate-float ml-2 sm:ml-8 md:ml-16">
            {/* Glow */}
            <div className="absolute -inset-10 rounded-full bg-gradient-to-tr from-accent-blue/20 to-accent-green/20 blur-3xl"></div>

            {/* Bot (SVG) */}
            <svg viewBox="0 0 520 640" className="relative w-full h-full">
              {/* iPad Head with antenna and side ears */}
              <g>
                {/* Antenna */}
                <circle cx="260" cy="40" r="16" fill="#4b5563" stroke="#374151" strokeWidth="3"/>
                <rect x="252" y="58" width="16" height="20" rx="8" fill="#4b5563" stroke="#374151" strokeWidth="3"/>
                {/* Tablet frame */}
                <rect x="130" y="90" width="260" height="170" rx="26" fill="#2b3342" stroke="#111827" strokeWidth="6" />
                <rect x="145" y="105" width="230" height="140" rx="18" fill="#cfe9f1" />
                {/* Side ears */}
                <ellipse cx="130" cy="175" rx="24" ry="46" fill="#4b5563" stroke="#374151" strokeWidth="4"/>
                <ellipse cx="390" cy="175" rx="24" ry="46" fill="#4b5563" stroke="#374151" strokeWidth="4"/>
                {/* Screen content */}
                <foreignObject x="150" y="108" width="220" height="134">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full flex items-center justify-center">
                    <div className="text-center leading-tight">
                      <div className="bot-screen-glow text-[#0b2942] font-extrabold" style={{fontSize:'32px'}}>Specbud</div>
                      <div className="bot-typing text-[#0b2942]/80" style={{fontSize:'16px'}}>Find your perfect match</div>
                      {/* Face */}
                      <div className="mt-2">
                        <div style={{fontSize:'0'}}>
                          {/* cheeks/eyes/mouth built via spans styled by inline SVG foreignObject CSS */}
                        </div>
                      </div>
                    </div>
                  </div>
                </foreignObject>
              </g>

              {/* Body - rounded torso */}
              <g fill="#5b6676" stroke="#374151" strokeWidth="3">
                {/* Neck ring */}
                <ellipse cx="260" cy="270" rx="60" ry="18" fill="#3b4452"/>
                {/* Torso */}
                <path d="M190,288 C190,260 330,260 330,288 L330,420 C330,460 300,494 260,494 C220,494 190,460 190,420 Z" fill="#5b6676"/>
              </g>

              {/* Left arm relaxed */}
              <g fill="#5b6676" stroke="#374151" strokeWidth="3">
                <circle cx="200" cy="320" r="20" />
                <rect x="170" y="330" width="36" height="70" rx="16" />
                <rect x="160" y="395" width="38" height="65" rx="16" transform="rotate(10 179 428)" />
                <ellipse cx="186" cy="460" rx="18" ry="14" fill="#4b5563" />
              </g>

              {/* Right arm thumbs up */}
              <g fill="#5b6676" stroke="#374151" strokeWidth="3">
                <circle cx="320" cy="320" r="20" />
                <rect x="314" y="335" width="36" height="68" rx="16" transform="rotate(-8 332 369)" />
                {/* Forearm up */}
                <rect x="340" y="300" width="36" height="90" rx="16" transform="rotate(70 358 345)" />
                {/* Thumb and fingers */}
                <rect x="388" y="250" width="28" height="40" rx="14" transform="rotate(20 402 270)" />
                <rect x="380" y="280" width="18" height="28" rx="9" />
                <rect x="398" y="278" width="18" height="28" rx="9" />
              </g>

              {/* Hips and legs */}
              <g fill="#5b6676" stroke="#374151" strokeWidth="3">
                <rect x="228" y="494" width="64" height="26" rx="12" fill="#4b5563"/>
                {/* Thighs */}
                <rect x="214" y="520" width="32" height="60" rx="12" />
                <rect x="274" y="520" width="32" height="60" rx="12" />
                {/* Knees */}
                <circle cx="230" cy="580" r="8" />
                <circle cx="290" cy="580" r="8" />
                {/* Calves */}
                <rect x="214" y="588" width="28" height="38" rx="10" />
                <rect x="274" y="588" width="28" height="38" rx="10" />
                {/* Feet */}
                <ellipse cx="228" cy="628" rx="24" ry="10" fill="#4b5563" />
                <ellipse cx="300" cy="628" rx="24" ry="10" fill="#4b5563" />
              </g>
            </svg>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white mb-8 leading-tight">
            Find Your Perfect <span className="bg-gradient-to-r from-accent-blue to-accent-green bg-clip-text text-transparent">Tech Match</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Smarter, Faster, Better.
          </p>
          
          {/* Product Suggestion Form */}
          <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <p className="text-white text-lg mb-6">Tell us your needs → Get product suggestions</p>
            <div className="space-y-4">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-accent-blue focus:outline-none"
              >
                <option value="">Select Category</option>
                <option value="laptops">Laptops</option>
                <option value="phones">Phones</option>
                <option value="tablets">Tablets</option>
                <option value="earphones">Earphones</option>
              </select>
              
              <select 
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-accent-blue focus:outline-none"
              >
                <option value="">Budget Range</option>
                <option value="under-50k">Under ₹50,000</option>
                <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                <option value="1l-2l">₹1,00,000 - ₹2,00,000</option>
                <option value="above-2l">Above ₹2,00,000</option>
              </select>
              
              <select 
                value={selectedUseCase}
                onChange={(e) => setSelectedUseCase(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-accent-blue focus:outline-none"
              >
                <option value="">Use Case</option>
                <option value="gaming">Gaming</option>
                <option value="office">Office Work</option>
                <option value="creative">Creative Work</option>
                <option value="general">General Use</option>
              </select>
              
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  if (selectedCategory) params.set('category', selectedCategory);
                  if (selectedBudget) params.set('budget', selectedBudget);
                  if (selectedUseCase) params.set('useCase', selectedUseCase);
                  navigate(`/products?${params.toString()}`);
                }}
                className="w-full bg-gradient-to-r from-accent-blue to-accent-green text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Find My Perfect Match
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SpecBud Section */}
      <section className="py-20 lg:py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-8">
              Why Choose SpecBud?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your ultimate tech shopping companion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 lg:py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-20 text-center">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayCategories.map((category) => (
              <div key={category.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors duration-300">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">{category.name}</h3>
                <p className="text-gray-300">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-20 lg:py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-white">
              Trending Products
            </h2>
            <Link to="/products" className="text-accent-green text-lg font-medium hover:underline">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map((product) => (
              <div key={product.id} className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors duration-300">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className={`absolute top-2 right-2 ${product.badgeColor} text-white px-2 py-1 rounded text-sm font-medium`}>
                    {product.badge}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{product.specs.processor}, {product.specs.graphics}, {product.specs.display}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-accent-green text-xl font-bold">₹{product.price.toLocaleString()}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < product.rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-accent-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300">
                      Compare
                    </button>
                    <button className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-300">
                      Reviews
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Test Section - Remove this in production */}
      <section className="py-20 lg:py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ApiTest />
        </div>
      </section>
      
    </div>
  );
};

export default Home;