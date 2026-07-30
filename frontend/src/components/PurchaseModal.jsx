import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, User, Phone, MapPin, FileText, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatINR } from '../utils/currency';

const PurchaseModal = ({ isOpen, onClose, onSubmit, vehicle }) => {
  const [formData, setFormData] = useState({
    buyer_name: '',
    buyer_phone: '',
    delivery_address: '',
    note: '',
    quantity: 1,
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        buyer_name: '',
        buyer_phone: '',
        delivery_address: '',
        note: '',
        quantity: 1,
      });
      setError('');
      setSubmitting(false);
    }
  }, [vehicle, isOpen]);

  if (!isOpen || !vehicle) return null;

  const maxQuantity = Math.max(1, vehicle.quantity || 1);
  const totalPrice = (vehicle.price || 0) * (formData.quantity || 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.buyer_name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.buyer_phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    if (!formData.delivery_address.trim()) {
      setError('Please enter your delivery address.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await onSubmit(vehicle.id, {
        buyer_name: formData.buyer_name.trim(),
        buyer_phone: formData.buyer_phone.trim(),
        delivery_address: formData.delivery_address.trim(),
        note: formData.note.trim(),
        quantity: Number(formData.quantity) || 1,
      });
    } catch (err) {
      setError('An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-[92vw] sm:w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Complete Vehicle Purchase</h2>
              <p className="text-xs text-cyan-100 font-medium">
                Review item details and enter delivery information below.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Vehicle Snapshot Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                {vehicle.category} • {vehicle.year}
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                {vehicle.maker} {vehicle.model}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Unit Price: <span className="text-slate-200 font-semibold">{formatINR(vehicle.price)}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Cost</span>
              <span className="text-lg font-black text-cyan-400">{formatINR(totalPrice)}</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3.5">
            <div>
              <label htmlFor="buyer_name" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="buyer_name"
                type="text"
                required
                placeholder="e.g. Alice Smith"
                value={formData.buyer_name}
                onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="buyer_phone" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  Phone Number <span className="text-rose-400">*</span>
                </label>
                <input
                  id="buyer_phone"
                  type="text"
                  required
                  placeholder="+1 555-0199"
                  value={formData.buyer_phone}
                  onChange={(e) => setFormData({ ...formData, buyer_phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                  Quantity (Max {vehicle.quantity})
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="delivery_address" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Delivery Address <span className="text-rose-400">*</span>
              </label>
              <textarea
                id="delivery_address"
                required
                rows="2"
                placeholder="Street address, city, state, zip code"
                value={formData.delivery_address}
                onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              ></textarea>
            </div>

            <div>
              <label htmlFor="note" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Delivery Note / Instructions (Optional)
              </label>
              <input
                id="note"
                type="text"
                placeholder="e.g. Call prior to delivery"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Confirm Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseModal;
