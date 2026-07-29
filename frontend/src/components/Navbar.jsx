import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Car, Search, Filter, LogIn, LogOut, ShieldCheck, User as UserIcon, RotateCcw, ArrowUpDown, Menu, X } from 'lucide-react';

const categories = ['All', 'Sedan', 'SUV', 'Truck', 'Electric', 'Coupe'];

const Navbar = ({ filters, onFilterChange, onResetFilters, onOpenAuth, onOpenProfile }) => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const username = user ? user.email.split('@')[0] : '';
  const initial = username ? username.charAt(0).toUpperCase() : '';

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 sm:px-6 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Top Row: Logo, Title & Right Action Controls (User/Auth & Mobile Toggle) */}
        <div className="w-full md:w-auto flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 sm:p-2.5 rounded-xl shadow-lg shadow-cyan-500/20">
              <Car className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">DriveHub Dealership</h1>
              <p className="text-[10px] sm:text-[11px] text-slate-400">Inventory Catalog</p>
            </div>
          </div>

          {/* Right Action Controls: User Profile / Auth Button & Hamburger Menu Toggle */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenProfile}
                  aria-label="View user profile"
                  className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 hover:border-slate-600 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                    {initial}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-white leading-tight capitalize max-w-[110px] truncate">
                      {username}
                    </p>
                    <span
                      className={`text-[10px] font-semibold flex items-center gap-1 ${
                        user.role === 'admin' ? 'text-amber-400' : 'text-cyan-400'
                      }`}
                    >
                      {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                </button>

                <button
                  onClick={logout}
                  aria-label="Logout"
                  className="px-2.5 sm:px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="text-xs">Login / Register</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu filter controls"
              className="md:hidden p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Center: Desktop Top Bar Search & Filter Controls */}
        <div className="hidden md:flex flex-1 w-full max-w-2xl items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search maker or model..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative min-w-[110px]">
            <select
              value={filters.category || 'All'}
              onChange={(e) => onFilterChange('category', e.target.value === 'All' ? '' : e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-7 py-1.5 text-xs text-white appearance-none focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat === 'All' ? 'All Types' : cat}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[110px]">
            <select
              aria-label="Sort vehicles"
              value={filters.sort || 'default'}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-7 py-1.5 text-xs text-white appearance-none focus:outline-none focus:border-cyan-500 cursor-pointer text-ellipsis overflow-hidden"
            >
              <option value="default" className="bg-slate-900 text-white">Sort: Default</option>
              <option value="price_asc" className="bg-slate-900 text-white">Price: Low to High</option>
              <option value="price_desc" className="bg-slate-900 text-white">Price: High to Low</option>
              <option value="newest" className="bg-slate-900 text-white">Newest First</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-1 min-w-[140px]">
            <input
              type="number"
              placeholder="Min USD"
              value={filters.min_price || ''}
              onChange={(e) => onFilterChange('min_price', e.target.value)}
              className="w-16 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
            <span className="text-slate-600 text-xs">-</span>
            <input
              type="number"
              placeholder="Max USD"
              value={filters.max_price || ''}
              onChange={(e) => onFilterChange('max_price', e.target.value)}
              className="w-16 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            title="Reset Filters"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

        {/* Mobile Collapsible Filter Panel */}
        {isMobileMenuOpen && (
          <div data-testid="mobile-filter-panel" className="md:hidden w-full pt-3 pb-1 border-t border-slate-800 flex flex-col gap-3">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search maker or model..."
                value={filters.search || ''}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={filters.category || 'All'}
                  onChange={(e) => onFilterChange('category', e.target.value === 'All' ? '' : e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-white">
                      {cat === 'All' ? 'All Types' : cat}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  aria-label="Sort vehicles"
                  value={filters.sort || 'default'}
                  onChange={(e) => onFilterChange('sort', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="default" className="bg-slate-900 text-white">Sort: Default</option>
                  <option value="price_asc" className="bg-slate-900 text-white">Price: Low-High</option>
                  <option value="price_desc" className="bg-slate-900 text-white">Price: High-Low</option>
                  <option value="newest" className="bg-slate-900 text-white">Newest First</option>
                </select>
                <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Price Inputs & Reset */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min USD"
                value={filters.min_price || ''}
                onChange={(e) => onFilterChange('min_price', e.target.value)}
                className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="number"
                placeholder="Max USD"
                value={filters.max_price || ''}
                onChange={(e) => onFilterChange('max_price', e.target.value)}
                className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={onResetFilters}
                title="Reset Filters"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

