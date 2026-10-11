import React, { useState, useEffect } from 'react';
import { X, Save, Car, Shield } from 'lucide-react';

const AdminModal = ({ isOpen, onClose, onSubmit, vehicleToEdit }) => {
  const [formData, setFormData] = useState({
    maker: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Sedan',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        maker: vehicleToEdit.maker || '',
        model: vehicleToEdit.model || '',
        year: vehicleToEdit.year || new Date().getFullYear(),
        category: vehicleToEdit.category || 'Sedan',
        price: vehicleToEdit.price || '',
        quantity: vehicleToEdit.quantity || ''
      });
    } else {
      setFormData({
        maker: '',
        model: '',
        year: new Date().getFullYear(),
        category: 'Sedan',
        price: '',
        quantity: ''
      });
    }
  }, [vehicleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      year: parseInt(formData.year, 10),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-stone-200 rounded-2xl w-[92vw] sm:w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl m-4">
        <div className="p-6 sm:p-7 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shadow-sm">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-stone-900 font-display tracking-tight">
                {vehicleToEdit ? 'Edit Vehicle Entry' : 'Add New Vehicle to Inventory'}
              </h2>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                {vehicleToEdit ? 'Modify specifications and pricing' : 'Create a new inventory catalog entry'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
                Maker / Brand
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Toyota"
                value={formData.maker}
                onChange={(e) => setFormData({ ...formData, maker: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
                Model
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Camry"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-colors outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
                Year
              </label>
              <input
                type="number"
                required
                min="1886"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-lg px-3.5 py-2.5 text-sm text-stone-900 transition-colors outline-none cursor-pointer"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Electric">Electric</option>
                <option value="Coupe">Coupe</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
                Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                required
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
                Initial Stock Quantity
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-colors outline-none"
              />
            </div>
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
              <Save className="w-4 h-4" />
              {vehicleToEdit ? 'Save Changes' : 'Create Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
