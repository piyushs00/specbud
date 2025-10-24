import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  // Apply theme to html element
  React.useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 shadow-sm">
      <div className="w-full pl-2 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-3xl font-display font-bold hover:scale-105 transition-transform duration-300"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-accent-blue to-accent-green rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">SB</span>
            </div>
            <span className="text-white">
              Spec<span className="text-accent-green">Bud</span>
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`text-lg font-medium transition-all duration-300 hover:scale-105 ${
                location.pathname === '/' 
                  ? 'text-accent-blue font-semibold' 
                  : 'text-gray-300 hover:text-accent-blue'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`text-lg font-medium transition-all duration-300 hover:scale-105 ${
                location.pathname === '/products' 
                  ? 'text-accent-blue font-semibold' 
                  : 'text-gray-300 hover:text-accent-blue'
              }`}
            >
              Products
            </Link>
            <Link 
              to="/compare" 
              className={`text-lg font-medium transition-all duration-300 hover:scale-105 ${
                location.pathname === '/compare' 
                  ? 'text-accent-blue font-semibold' 
                  : 'text-gray-300 hover:text-accent-blue'
              }`}
            >
              Compare
            </Link>
            <Link 
              to="/deals" 
              className={`text-lg font-medium transition-all duration-300 hover:scale-105 ${
                location.pathname === '/deals' 
                  ? 'text-accent-blue font-semibold' 
                  : 'text-gray-300 hover:text-accent-blue'
              }`}
            >
              Deals
            </Link>
            <Link 
              to="/reviews" 
              className={`text-lg font-medium transition-all duration-300 hover:scale-105 ${
                location.pathname === '/reviews' 
                  ? 'text-accent-blue font-semibold' 
                  : 'text-gray-300 hover:text-accent-blue'
              }`}
            >
              Reviews
            </Link>
            <Link 
              to="/about" 
              className={`text-lg font-medium whitespace-nowrap transition-all duration-300 hover:scale-105 ${
                location.pathname === '/about' 
                  ? 'text-accent-blue font-semibold' 
                  : 'text-gray-300 hover:text-accent-blue'
              }`}
            >
              About Us
            </Link>
          </div>

          {/* Search Bar, Theme Toggle and Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-gray-800 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = search.trim();
                    if (q) navigate(`/products?q=${encodeURIComponent(q)}`);
                  }
                }}
                placeholder="Search for tech products..." 
                className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-64"
              />
              <button
                onClick={() => {
                  const q = search.trim();
                  if (q) navigate(`/products?q=${encodeURIComponent(q)}`);
                }}
                className="ml-2 text-sm text-white/80 hover:text-white"
              >
                Search
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark((v) => !v)}
              className="hidden sm:inline-flex items-center bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
              title="Toggle theme"
            >
              {isDark ? 'Light' : 'Dark'}
            </button>
            
            {/* Auth Buttons */}
            <Link to="/login" className="bg-accent-blue text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap hover:bg-blue-600 transition-colors duration-300">
              Sign In
            </Link>
            <Link to="/signup" className="bg-accent-green text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap hover:bg-green-600 transition-colors duration-300">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
