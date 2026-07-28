import React, { useState, useRef, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import {
  Car,
  LogIn,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  ChevronDown,
  Settings,
  PlusCircle,
  ShoppingBag,
  Activity,
} from 'lucide-react';

const Navbar = ({ onOpenAuth, onOpenAddVehicle, onOpenProfile }) => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const username = user ? user.email.split('@')[0] : '';
  const initial = username ? username.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-cyan-500/20">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">DriveHub Dealership</h1>
            <p className="text-xs text-slate-400">Premium Vehicle Inventory</p>
          </div>
        </div>

        {/* User Actions & Profile Button */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer group"
              >
                {/* Avatar Badge */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm group-hover:scale-105 transition-transform">
                  {initial}
                </div>

                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-white leading-tight capitalize max-w-[120px] truncate">
                    {username}
                  </p>
                  <span
                    className={`text-[10px] font-semibold flex items-center gap-1 ${
                      user.role === 'admin' ? 'text-amber-400' : 'text-cyan-400'
                    }`}
                  >
                    {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                    {user.role === 'admin' ? 'Admin' : 'Customer'}
                  </span>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                  {/* Dropdown Header */}
                  <div className="p-4 border-b border-slate-800 bg-slate-950/60">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user.email}</p>
                    <span
                      className={`mt-2 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        user.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                      {user.role === 'admin' ? 'Administrator' : 'Customer Account'}
                    </span>
                  </div>

                  {/* Dropdown Options */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-cyan-400" />
                      View Account Profile
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenAddVehicle();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4 text-emerald-400" />
                        + Add New Vehicle
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                      My Purchases & History
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-indigo-400" />
                      Account Settings
                    </button>

                    <div className="px-3 py-1.5 text-[11px] text-slate-500 flex items-center gap-2 border-t border-slate-800/60 mt-1">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      PostgreSQL Database Connected
                    </div>
                  </div>

                  {/* Dropdown Footer (Logout Button at the bottom) */}
                  <div className="p-2 border-t border-slate-800 bg-slate-950/40">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium text-sm rounded-lg transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Login / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
