import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Car, LogIn, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';

const Navbar = ({ onOpenAuthModal, onOpenAddVehicleModal }) => {
  const { user, logout } = useContext(AuthContext);

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

        {/* User / Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' && (
                <button
                  onClick={onOpenAddVehicleModal}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium text-sm rounded-lg transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
                >
                  + Add Vehicle
                </button>
              )}

              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-lg text-sm">
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span className="text-slate-200 font-medium">{user.email}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                    user.role === 'admin'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                  {user.role}
                </span>
              </div>

              <button
                onClick={logout}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium text-sm rounded-lg transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium text-sm rounded-lg transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
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
