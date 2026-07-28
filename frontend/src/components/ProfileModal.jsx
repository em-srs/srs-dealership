import React from 'react';
import { X, User, Shield, Mail, Calendar, Key, CheckCircle2 } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const username = user.email.split('@')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-950/40 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white text-2xl font-black shadow-xl">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight capitalize">{username}</h2>
              <p className="text-xs text-cyan-100 font-medium">{user.email}</p>
              <span className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${
                user.role === 'admin'
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                  : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
              }`}>
                <Shield className="w-3 h-3" />
                {user.role === 'admin' ? 'Administrator Account' : 'Customer Account'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-xs text-slate-400">Email Address</p>
                  <p className="text-sm font-semibold text-white">{user.email}</p>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-xs text-slate-400">Assigned Access Role</p>
                  <p className="text-sm font-semibold text-white capitalize">{user.role}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-mono">ID: #{user.id || 1}</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-indigo-400" />
                <div>
                  <p className="text-xs text-slate-400">Security & Authentication</p>
                  <p className="text-sm font-semibold text-white">JWT Bearer Token Encrypted</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
