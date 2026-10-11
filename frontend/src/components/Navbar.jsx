import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import MobileNavMenu from './MobileNavMenu';
import { Car, LogIn, LogOut, Menu, X, Sparkles, Shield } from 'lucide-react';

const Navbar = ({ filters, onFilterChange, onResetFilters, onOpenAuth, onOpenProfile, onOpenAddVehicle, activeTab, setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const username = user ? user.email.split('@')[0] : '';
  const initial = username ? username.charAt(0).toUpperCase() : '';

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => setActiveTab && setActiveTab('catalog')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight font-display">
                DriveHub Dealership
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Dealership
              </p>
            </div>
          </div>
        </div>

        {/* Center: Nav tabs (desktop only) */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActiveTab && setActiveTab('catalog')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'catalog'
                ? 'text-white bg-white/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('catalog');
              setTimeout(() => {
                const el = document.getElementById('contact-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white hover:bg-white/5"
          >
            Contact
          </button>
          {user && user.role === 'admin' && (
            <button
              onClick={() => setActiveTab && setActiveTab('admin')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'text-white bg-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Inventory
            </button>
          )}
        </nav>

        {/* Right: User Controls */}
        <div className="flex items-center gap-3">
          {/* Desktop User Controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={onOpenProfile}
                  aria-label="View user profile"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-xs">
                    {initial}
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-slate-200 leading-tight">
                      {username}
                    </p>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {user.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                </button>

                <button
                  onClick={logout}
                  aria-label="Logout"
                  className="px-3 py-2 text-slate-400 hover:text-red-400 text-xs font-medium rounded-lg hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-white text-[#0f172a] font-semibold text-sm rounded-lg hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login / Register</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu navigation"
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu Drawer */}
      {isMobileMenuOpen && (
        <MobileNavMenu
          user={user}
          username={username}
          initial={initial}
          onOpenAuth={onOpenAuth}
          onOpenProfile={onOpenProfile}
          onOpenAddVehicle={onOpenAddVehicle}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          logout={logout}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
