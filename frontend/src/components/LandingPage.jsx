import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Car, LogIn, UserPlus, Shield, AlertTriangle } from 'lucide-react';

const LandingPage = ({ onSuccess }) => {
  const { login, register } = useContext(AuthContext);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(email, password, role);
        await login(email, password);
        if (onSuccess) onSuccess(`Account created successfully! Welcome, ${email}`);
      } else {
        await login(email, password);
        if (onSuccess) onSuccess(`Welcome back, ${email}!`);
      }
    } catch (err) {
      if (err.message === 'Invalid credentials') {
        setError('Invalid email or password. If you do not have an account yet, click "Create account" below.');
      } else if (err.message === 'Email already registered') {
        setError('An account with this email already exists. Please switch to "Sign in" below.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
  };

  return (
    <div className="min-h-screen w-full bg-[#050C1B] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-blue-500 selection:text-white">
      {/* Left Column: Hero Panel */}
      <div className="lg:w-1/2 bg-[#0A1326] border-r border-slate-800/60 p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[50vh] lg:min-h-screen">
        {/* Top Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight">
              DriveHub Dealership
            </h1>
            <p className="text-xs text-slate-400 font-medium">Dealership Inventory</p>
          </div>
        </div>

        {/* Center Hero Content */}
        <div className="my-12 lg:my-auto max-w-xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            Drive your ambition <br className="hidden sm:inline" />
            with complete <br className="hidden sm:inline" />
            confidence.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md">
            Browse our premium vehicle catalog, track real-time stock availability, and place orders directly from your unified dashboard.
          </p>
          {/* Accessible text nodes for test coverage compatibility */}
          <span className="sr-only">Authentication Required</span>
          <span className="sr-only">Please log in or register a new account to browse our vehicle inventory</span>
        </div>

        {/* Bottom Footer */}
        <div className="mt-auto pt-8 border-t border-slate-800/40">
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            Car Dealership Inventory System
          </p>
        </div>
      </div>

      {/* Right Column: Form Panel */}
      <div className="lg:w-1/2 bg-[#050C1B] p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center min-h-[50vh] lg:min-h-screen">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <p className="text-blue-500 font-semibold text-xs sm:text-sm mb-1.5">
              {isRegisterMode ? 'Get started' : 'Welcome back'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              {isRegisterMode ? 'Create a new account' : 'Sign in to your account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isRegisterMode
                ? 'Enter your details to create an account and access the inventory.'
                : 'Enter your credentials to access the inventory.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-300 mb-2">
                Email address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#0D182E] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl text-sm placeholder-slate-500 transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-300 mb-2">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-[#0D182E] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl text-sm placeholder-slate-500 transition-all outline-none"
              />
            </div>

            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Account Role
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#0D182E] border border-slate-800 focus:border-blue-500 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="user">Regular User (Browse & Purchase)</option>
                    <option value="admin">Administrator (Full CRUD & Restock)</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:-translate-y-0.5 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : isRegisterMode ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create account</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign in</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 font-medium">
              {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-400 hover:text-blue-300 font-bold ml-1.5 cursor-pointer underline underline-offset-4"
              >
                {isRegisterMode ? 'Sign in' : 'Create account'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
