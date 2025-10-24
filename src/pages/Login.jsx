import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder action
    alert(`Logged in as ${email}`);
  };

  return (
    <div className="bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-display font-bold text-white mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-accent-blue focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-accent-blue focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-accent-blue to-accent-green text-white px-6 py-3 rounded-lg font-semibold">
            Login
          </button>
        </form>
      </div>

      {/* Newsletter (Stay Ahead with SpecBud) */}
      <section className="mt-16 bg-gradient-to-r from-dark-blue via-gray-900 to-dark-green rounded-2xl p-8 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-display font-bold text-white mb-4">Stay Ahead with SpecBud</h2>
        <p className="text-gray-300 mb-6">Get the latest tech news, best deals, and product recommendations in your inbox</p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-accent-blue focus:outline-none"
          />
          <button className="bg-gradient-to-r from-accent-blue to-accent-green text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default Login;


