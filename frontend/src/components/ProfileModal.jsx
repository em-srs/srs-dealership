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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-stone-200 rounded-2xl w-[92vw] sm:w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header Banner */}
        <div className="bg-[#0f172a] p-6 sm:p-7 relative shrink-0 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-xl font-bold shadow-sm shrink-0 font-display">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight capitalize font-display">{username}</h2>
              <p className="text-xs text-stone-300 font-medium">{user.email}</p>
              <span className={`mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
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
          <div className="flex flex-wrap gap-2 mt-6 border-b border-white/10 pb-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Account Info
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Purchase History ({purchases.length})
            </button>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 sm:p-7 space-y-4 flex-1">
          {activeTab === 'profile' ? (
            <div className="space-y-3">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-stone-200 text-stone-700">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Email Address</p>
                    <p className="text-sm font-bold text-stone-900 mt-0.5">{user.email}</p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Assigned Access Role</p>
                    <p className="text-sm font-bold text-stone-900 capitalize mt-0.5">{user.role}</p>
                  </div>
                </div>
                <span className="text-xs text-stone-600 font-mono bg-stone-200 px-2.5 py-1 rounded-md">
                  ID: #{user.id || 1}
                </span>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-stone-200 text-stone-700">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Security & Authentication</p>
                    <p className="text-sm font-bold text-stone-900 mt-0.5">JWT Bearer Token Encrypted</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {loadingHistory ? (
                <div className="py-8 text-center">
                  <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-stone-500 mt-2 font-bold uppercase tracking-wider">Loading orders...</p>
                </div>
              ) : purchases.length === 0 ? (
                <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 text-center">
                  <PackageCheck className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-stone-900 font-display">No Purchase History Found</h4>
                  <p className="text-xs text-stone-500 mt-1">You haven't completed any vehicle orders yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {purchases.map((order) => (
                    <div key={order.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-stone-700" />
                          <h4 className="text-sm font-bold text-stone-900 font-display">
                            {order.vehicle_maker} {order.vehicle_model}
                          </h4>
                        </div>
                        <span className="text-sm font-bold text-stone-900 font-display">
                          {formatINR(order.price_at_purchase * order.quantity)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-stone-500 pt-1 border-t border-stone-200">
                        <div>
                          <span>Quantity: </span>
                          <span className="text-stone-900 font-bold">{order.quantity} unit(s)</span>
                        </div>
                        <div className="flex items-center gap-1 text-right justify-end">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{new Date(order.purchased_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="text-xs text-stone-600 bg-white p-3 rounded-lg border border-stone-200 mt-1 space-y-1">
                        <p><span className="text-stone-400">Buyer:</span> <strong className="text-stone-800">{order.buyer_name}</strong> ({order.buyer_phone})</p>
                        <p className="truncate"><span className="text-stone-400">Address:</span> {order.delivery_address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-stone-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-200 transition-colors cursor-pointer"
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
