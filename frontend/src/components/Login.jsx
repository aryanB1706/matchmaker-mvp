import React, { useState } from 'react';
import { Heart, Lock, User, Sparkles, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for premium feel
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Invalid username or password. Try admin / admin.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-radial from-rose-500 via-purple-700 to-slate-950 p-4 relative overflow-hidden">
      
      {/* Decorative floating blurred blobs for premium look */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

      {/* Main glass card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:border-white/30 z-10">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-2xl shadow-lg shadow-rose-500/30 mb-4 animate-bounce">
            <Heart className="w-8 h-8 text-white fill-white/80" />
            <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Milan</h1>
          <p className="text-white/60 text-sm mt-1">Premium Matchmaking Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/80">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/80">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/50" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-rose-500/20 active:scale-98 transition-all duration-200 overflow-hidden group cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing In...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                Let's Find Matches
                <Sparkles className="w-4 h-4 ml-1 text-yellow-300 animate-pulse" />
              </span>
            )}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
          </button>

          {/* Hint */}
          <div className="text-center text-xs text-white/40">
            Use username <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">admin</code> & password <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">admin</code>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
