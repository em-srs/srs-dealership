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
      className="md:hidden bg-[#0f172a] border-t border-slate-800 px-4 pb-4 pt-2 flex flex-col gap-2 text-sm"
    >
      {user ? (
        <>
          {/* User Info */}
          <div
            onClick={() => {
              onOpenProfile();
              if (onClose) onClose();
            }}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                {initial}
              </div>
              <div>
                <p className="font-semibold text-white leading-tight capitalize">
                  {user.role === 'admin' ? 'Admin User' : username}
                </p>
                <span className="text-xs text-slate-400 block">
                  {user.role === 'admin' ? 'Administrator' : 'Customer'} ({user.email})
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium group-hover:text-white transition-colors">
              Profile →
            </span>
          </div>

          {/* Nav Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('catalog');
                if (onClose) onClose();
              }}
              className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Catalog</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => {
                  if (setActiveTab) setActiveTab('admin');
                  if (onClose) onClose();
                }}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Manage Inventory</span>
              </button>
            )}
          </div>

          {/* Contact */}
          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('catalog');
              if (onClose) onClose();
              setTimeout(() => {
                const el = document.getElementById('contact-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-full py-2.5 px-4 text-slate-300 hover:text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Contact Dealership</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              if (onClose) onClose();
            }}
            className="w-full py-2.5 px-4 text-slate-400 hover:text-red-400 font-medium text-sm rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1 border-t border-slate-800 pt-3"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onOpenAuth();
              if (onClose) onClose();
            }}
            className="w-full py-3 bg-white text-[#0f172a] font-semibold text-sm rounded-lg hover:bg-slate-100 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('catalog');
              if (onClose) onClose();
              setTimeout(() => {
                const el = document.getElementById('contact-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-full py-2.5 px-4 text-slate-300 hover:text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Contact Dealership</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileNavMenu;
