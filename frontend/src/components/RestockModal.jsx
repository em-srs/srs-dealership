import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

const RestockModal = ({ isOpen, onClose, onSubmit, vehicle }) => {
  const [amount, setAmount] = useState(1);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(vehicle.id, parseInt(amount, 10));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            Restock Inventory
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-semibold text-white">
              {vehicle.maker} {vehicle.model} ({vehicle.year})
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Current Stock Quantity: <span className="text-cyan-400 font-bold">{vehicle.quantity}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Additional Units to Add
            </label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockModal;
