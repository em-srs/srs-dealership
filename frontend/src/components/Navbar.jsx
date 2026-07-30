import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Car, Search, Filter, LogIn, LogOut, ShieldCheck, User as UserIcon, RotateCcw, ArrowUpDown, Menu, X, PlusCircle } from 'lucide-react';

const categories = ['All', 'Sedan', 'SUV', 'Truck', 'Electric', 'Coupe'];

const Navbar = ({ filters, onFilterChange, onResetFilters, onOpenAuth, onOpenProfile, onOpenAddVehicle, activeTab, setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const username = user ? user.email.split('@')[0] : '';
  const initial = username ? username.charAt(0).toUpperCase() : '';

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 sm:px-6 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => setActiveTab && setActiveTab('catalog')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-gradient-to-tr from-indigo-600 to-blue-600 p-2 sm:p-2.5 rounded-xl shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">DriveHub Dealership</h1>
              <p className="text-[10px] sm:text-[11px] text-slate-400">Inventory Catalog</p>
            </div>
          </div>
        </div>

        {/* Right: User Profile & Manage Inventory & Logout Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenProfile}
                aria-label="View user profile"
                className="flex items-center gap-2.5 hover:opacity-90 transition-all cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white leading-tight capitalize">
                    {user.role === 'admin' ? 'Admin User' : username}
                  </p>
                  <span className="text-[10px] font-medium text-slate-400 block">
                    {user.role === 'admin' ? 'Administrator' : 'Customer'} (<span className="text-slate-400">{username}</span>)
                  </span>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                  {initial}
                </div>
              </button>

              {user.role === 'admin' && (
                <button
                  onClick={() => setActiveTab && setActiveTab('admin')}
                  aria-label="Manage Inventory"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Manage Inventory</span>
                </button>
              )}

              <button
                onClick={logout}
                aria-label="Logout"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
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

      {/* Mobile Collapsible Filter Drawer */}
      {isMobileMenuOpen && (
        <div data-testid="mobile-filter-panel" className="md:hidden max-w-7xl mx-auto pt-3 pb-1 mt-3 border-t border-slate-800 flex flex-col gap-3">
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
    </header>
  );
};

export default Navbar;

