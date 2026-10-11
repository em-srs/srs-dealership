import React, { useState } from 'react';
import { X, PlusCircle, Layers } from 'lucide-react';

const RestockModal = ({ isOpen, onClose, onSubmit, vehicle }) => {
  const [amount, setAmount] = useState(1);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(vehicle.id, parseInt(amount, 10));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-stone-200 rounded-2xl w-[92vw] sm:w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 sm:p-7 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 font-display tracking-tight">
                Restock Inventory
              </h2>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Increment vehicle inventory allocation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <h4 className="font-extrabold text-stone-900 font-display text-base">
              {vehicle.maker} {vehicle.model} ({vehicle.year})
            </h4>
            <p className="text-xs text-stone-600 mt-1 font-medium">
              Current Stock Quantity: <span className="text-emerald-700 font-bold">{vehicle.quantity}</span> units
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
              Additional Units to Add
            </label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-lg px-3.5 py-2.5 text-sm text-stone-900 transition-colors outline-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
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
