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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-stone-200 rounded-2xl w-[92vw] sm:w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header Banner */}
        <div className="bg-[#0f172a] p-6 sm:p-7 relative shrink-0 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-white/10 rounded-xl text-white shadow-sm border border-white/15">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight font-display">
                Complete Vehicle Purchase
              </h2>
              <p className="text-xs text-stone-300 font-medium mt-0.5">
                Review item details and enter delivery information below.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4 flex-1">
          {/* Vehicle Snapshot Card */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block font-display">
                {vehicle.category} • {vehicle.year}
              </span>
              <h4 className="text-base font-extrabold text-stone-900 mt-0.5 font-display">
                {vehicle.maker} {vehicle.model}
              </h4>
              <p className="text-xs text-stone-500 mt-1 font-medium">
                Unit Price: <span className="text-stone-800 font-bold">{formatINR(vehicle.price)}</span>
              </p>
            </div>
            <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 block uppercase tracking-wider">Total Cost</span>
              <span className="text-xl font-extrabold text-stone-900 font-display">
                {formatINR(totalPrice)}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3.5">
            <div>
              <label htmlFor="buyer_name" className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                <User className="w-3.5 h-3.5 text-stone-500" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="buyer_name"
                type="text"
                required
                placeholder="e.g. Alice Smith"
                value={formData.buyer_name}
                onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white text-stone-900 placeholder-stone-400 rounded-lg px-3.5 py-2.5 text-sm transition-colors outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="buyer_phone" className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="buyer_phone"
                  type="text"
                  required
                  placeholder="+1 555-0199"
                  value={formData.buyer_phone}
                  onChange={(e) => setFormData({ ...formData, buyer_phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white text-stone-900 placeholder-stone-400 rounded-lg px-3.5 py-2.5 text-sm transition-colors outline-none"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                  <ShoppingBag className="w-3.5 h-3.5 text-stone-500" />
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
                      quantity: Math.min(maxQuantity, Math.max(1, parseInt(e.target.value, 10) || 1)),
                    })
                  }
                  className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white text-stone-900 placeholder-stone-400 rounded-lg px-3.5 py-2.5 text-sm transition-colors outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="delivery_address" className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="delivery_address"
                required
                rows="2"
                placeholder="Street address, city, state, zip code"
                value={formData.delivery_address}
                onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white text-stone-900 placeholder-stone-400 rounded-lg px-3.5 py-2 text-sm transition-colors outline-none resize-none"
              ></textarea>
            </div>

            <div>
              <label htmlFor="note" className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                <FileText className="w-3.5 h-3.5 text-stone-500" />
                Delivery Note / Instructions (Optional)
              </label>
              <input
                id="note"
                type="text"
                placeholder="e.g. Call prior to delivery"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white text-stone-900 placeholder-stone-400 rounded-lg px-3.5 py-2 text-sm transition-colors outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
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
