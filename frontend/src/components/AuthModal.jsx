import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { X, ArrowRight, Eye, EyeOff, Lock, Mail, Shield, AlertTriangle, Car, ArrowLeft } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useContext(AuthContext);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(email, password);
        await login(email, password);
        if (onSuccess) onSuccess(`Account created successfully! Welcome, ${email}`);
      } else {
        await login(email, password);
        if (onSuccess) onSuccess(`Welcome back, ${email}!`);
      }
      onClose();
    } catch (err) {
      if (err.message === 'Invalid credentials') {
        setError('Invalid email or password. If you do not have an account yet, click "Sign Up" below to create one.');
      } else if (err.message === 'Email already registered') {
        setError('An account with this email already exists. Please switch to "Log In" below.');
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
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-black animate-fade-in"
      style={{
        backgroundImage: `url('/auth-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Layered dark atmospheric vignette */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />

      {/* Minimal Top Brand & Navigation Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3 select-none">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white shadow-sm">
            <Car className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight font-display">
              DriveHub Dealership
            </h1>
            <p className="text-[9px] sm:text-[10px] text-stone-400 font-medium tracking-wider uppercase">
              Automotive Portal
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-white text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-sm"
          aria-label="Back to Showroom"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back to Showroom</span>
          <span className="sm:hidden text-xs">Back</span>
        </button>
      </header>

      {/* Centered Liquid-Glass Authentication Panel */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-6 my-auto">
        <div className="liquid-glass-panel w-full max-w-[480px] rounded-[22px] sm:rounded-[28px] p-6 sm:p-10 transition-all">
          {/* Sign In & Register Tabs */}
          <div className="flex items-center gap-6 border-b border-white/10 mb-7 pb-3">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setError('');
              }}
              className={`text-sm font-semibold tracking-wide transition-all relative pb-3 -mb-3 cursor-pointer ${
                !isRegisterMode
                  ? 'text-white border-b-2 border-white'
                  : 'text-stone-400 hover:text-stone-200 border-b-2 border-transparent'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setError('');
              }}
              className={`text-sm font-semibold tracking-wide transition-all relative pb-3 -mb-3 cursor-pointer ${
                isRegisterMode
                  ? 'text-white border-b-2 border-white'
                  : 'text-stone-400 hover:text-stone-200 border-b-2 border-transparent'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Header Info */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight">
              {isRegisterMode ? 'Create Your Account' : 'Welcome to DriveHub'}
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              {isRegisterMode
                ? 'Register to unlock vehicle purchasing and inventory controls'
                : 'Enter your credentials to access vehicle inventory and orders'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/25 text-red-200 text-xs rounded-xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="auth-email" className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-black/35 border border-white/10 focus:border-white/40 focus:bg-black/50 text-white placeholder-stone-500 rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="auth-password" className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/35 border border-white/10 focus:border-white/40 focus:bg-black/50 text-white placeholder-stone-500 rounded-xl pl-10 pr-11 py-3 text-sm transition-all outline-none font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>


            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white hover:bg-stone-200 text-[#0f172a] font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg active:scale-[0.99] disabled:opacity-50 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0f172a]/30 border-t-[#0f172a] rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : isRegisterMode ? (
                <>
                  <span>Register Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch Mode Toggle */}
          <div className="mt-6 text-center pt-5 border-t border-white/10">
            <button
              type="button"
              onClick={toggleMode}
              className="text-xs text-stone-400 hover:text-stone-200 transition-colors font-medium cursor-pointer"
            >
              {isRegisterMode ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-[11px] text-stone-500 font-mono">
        <span>DRIVEHUB AUTOMOTIVE DEALERSHIP</span>
        <span>SECURE AUTHENTICATION</span>
      </footer>
    </div>
  );
};

export default AuthModal;
