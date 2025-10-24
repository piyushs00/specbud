import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder action
    alert(`Logged in as ${email}`);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-spotify-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-spotify-green text-black font-extrabold flex items-center justify-center">SB</div>
          </Link>
        </div>

        <div className="bg-spotify-gray/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/5">
          <h1 className="text-3xl md:text-4xl font-semibold text-white text-center mb-6">Log in to SpecBud</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="spotify-input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="spotify-input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="spotify-button">Log In</button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-spotify-green hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


