import React from 'react';
import { LogIn, LogOut, ShieldCheck, User as UserIcon, PlusCircle, Car } from 'lucide-react';

const MobileNavMenu = ({
  user,
  username,
  initial,
  onOpenAuth,
  onOpenProfile,
  onOpenAddVehicle,
  activeTab,
  setActiveTab,
  logout,
  onClose,
}) => {
  return (
    <div
      data-testid="mobile-nav-menu"
      className="md:hidden bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 mt-3 shadow-2xl flex flex-col gap-3 text-xs animate-fade-in"
    >
      {user ? (
        <>
          {/* User Info Header Badge */}
          <div
            onClick={() => {
              onOpenProfile();
              if (onClose) onClose();
            }}
            className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
                {initial}
              </div>
              <div>
                <p className="font-bold text-white leading-tight capitalize">
                  {user.role === 'admin' ? 'Admin User' : username}
                </p>
                <span className="text-[10px] text-slate-400 font-medium block">
                  {user.role === 'admin' ? 'Administrator' : 'Customer'} ({user.email})
                </span>
              </div>
            </div>
            <span className="text-[11px] text-indigo-400 font-semibold">View Profile →</span>
          </div>

          {/* Navigation Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('catalog');
                if (onClose) onClose();
              }}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                activeTab === 'catalog'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4 text-indigo-400" />
              <span>Catalog View</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => {
                  if (setActiveTab) setActiveTab('admin');
                  if (onClose) onClose();
                }}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeTab === 'admin'
                    ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                    : 'bg-indigo-950/80 border-indigo-800 text-indigo-300 hover:bg-indigo-900'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-indigo-300" />
                <span>Manage Inventory</span>
              </button>
            )}
          </div>

          {/* Logout Action */}
          <button
            onClick={() => {
              logout();
              if (onClose) onClose();
            }}
            className="w-full py-2.5 px-4 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-900/60 text-rose-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout Account</span>
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            onOpenAuth();
            if (onClose) onClose();
          }}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <LogIn className="w-4 h-4 text-white" />
          <span>Login / Register</span>
        </button>
      )}
    </div>
  );
};

export default MobileNavMenu;
