import React, { useState, useEffect } from 'react';
import { X, ShieldAlert } from 'lucide-react';

const AdminModal = ({ isOpen, onClose, onSubmit, vehicleToEdit }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Sedan',
    price: '',
    quantity: 1,
  });

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        make: vehicleToEdit.make,
        model: vehicleToEdit.model,
        year: vehicleToEdit.year,
        category: vehicleToEdit.category,
        price: vehicleToEdit.price,
        quantity: vehicleToEdit.quantity,
      });
    } else {
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        category: 'Sedan',
        price: '',
        quantity: 1,
      });
    }
  }, [vehicleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      year: Number(formData.year),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          {vehicleToEdit ? 'Edit Vehicle Details' : 'Add New Vehicle'}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          {vehicleToEdit ? 'Update inventory specification for this vehicle' : 'Add a new vehicle entry to dealership inventory'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Make</label>
              <input
                type="text"
                required
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                placeholder="e.g. Toyota"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Model</label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. Camry"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Year</label>
              <input
                type="number"
                min="1886"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Electric">Electric</option>
                <option value="Coupe">Coupe</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="25000.00"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Quantity</label>
              <input
                type="number"
                min="0"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
            >
              {vehicleToEdit ? 'Save Changes' : 'Create Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
