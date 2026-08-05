import React, { useState, useEffect, useContext } from 'react';
import { X, User, Shield, Mail, Calendar, Key, CheckCircle2, ShoppingBag, Clock, PackageCheck } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { formatINR } from '../utils/currency';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const ProfileModal = ({ isOpen, onClose, user }) => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [purchases, setPurchases] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      fetchPurchaseHistory();
    }
  }, [isOpen, token]);

  /**
   * API CALL: Fetches user purchase history from the backend using the stored JWT authorization token.
   * Connected to: Backend GET /api/purchases/me endpoint
   * Requires: User JWT Bearer Token from AuthContext
   */
  const fetchPurchaseHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`${API_BASE}/purchases/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPurchases(data);
      } else {
        setPurchases([]);
      }
    } catch (err) {
      console.error('Error fetching purchase history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!isOpen || !user) return null;

  const username = user.email.split('@')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-[92vw] sm:w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-950/40 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white text-xl font-black shadow-xl shrink-0">
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

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-5 border-b border-white/10 pb-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white/20 text-white backdrop-blur-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Account Info
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white/20 text-white backdrop-blur-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Purchase History ({purchases.length})
            </button>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 space-y-4 flex-1">
          {activeTab === 'profile' ? (
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
          ) : (
            <div className="space-y-3">
              {loadingHistory ? (
                <div className="py-8 text-center">
                  <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-400 mt-2">Loading orders...</p>
                </div>
              ) : purchases.length === 0 ? (
                <div className="bg-slate-950/60 p-8 rounded-xl border border-slate-800 text-center">
                  <PackageCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-300">No Purchase History Found</h4>
                  <p className="text-xs text-slate-500 mt-1">You haven't completed any vehicle orders yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {purchases.map((order) => (
                    <div key={order.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-sm font-bold text-white">
                            {order.vehicle_maker} {order.vehicle_model}
                          </h4>
                        </div>
                        <span className="text-sm font-black text-cyan-400">
                          {formatINR(order.price_at_purchase * order.quantity)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-1 border-t border-slate-900">
                        <div>
                          <span>Quantity: </span>
                          <span className="text-slate-200 font-semibold">{order.quantity} unit(s)</span>
                        </div>
                        <div className="flex items-center gap-1 text-right justify-end">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{new Date(order.purchased_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                        <p><span className="text-slate-500">Buyer:</span> <strong className="text-slate-200">{order.buyer_name}</strong> ({order.buyer_phone})</p>
                        <p className="mt-0.5 truncate"><span className="text-slate-500">Address:</span> {order.delivery_address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
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
