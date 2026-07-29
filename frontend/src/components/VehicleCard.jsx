import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ShoppingCart, Edit, Trash2, PlusCircle, Calendar, Tag } from 'lucide-react';
import { formatINR } from '../utils/currency';

const categoryImages = {
  Sedan: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
  SUV: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&auto=format&fit=crop&q=80',
  Truck: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&auto=format&fit=crop&q=80',
  Electric: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format&fit=crop&q=80',
  Coupe: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format&fit=crop&q=80',
};

const VehicleCard = ({ vehicle, onPurchase, onEdit, onDelete, onRestock }) => {
  const { user } = useContext(AuthContext);
  const isOutOfStock = vehicle.quantity <= 0;
  const imageUrl = categoryImages[vehicle.category] || categoryImages.default;

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-slate-950">
        <img
          src={imageUrl}
          alt={`${vehicle.maker} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-200 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5 shadow-md">
          <Tag className="w-3 h-3 text-cyan-400" />
          {vehicle.category}
        </div>

        {/* Quantity Status Pill */}
        <div
          className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-semibold border backdrop-blur-md shadow-md ${
            isOutOfStock
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              : vehicle.quantity < 3
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Available`}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
              {vehicle.maker} {vehicle.model}
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {vehicle.year}
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Price</span>
              <span className="text-2xl font-extrabold text-white">
                {formatINR(vehicle.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls Section */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col gap-2">
          {/* Purchase Button — Always visible to all users */}
          <button
            onClick={() => onPurchase(vehicle.id)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50 shadow-none'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/25 active:scale-[0.98]'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? 'Out of Stock' : 'Purchase Vehicle'}
          </button>

          {/* Admin-Only Extra Controls — Layered conditionally on the card */}
          {user && user.role === 'admin' && (
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-1">
              <button
                onClick={() => onRestock(vehicle)}
                title="Restock Inventory"
                className="py-1.5 px-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] sm:text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Restock</span>
              </button>
              <button
                onClick={() => onEdit(vehicle)}
                title="Edit Vehicle Entry"
                className="py-1.5 px-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] sm:text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
              >
                <Edit className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Edit</span>
              </button>
              <button
                onClick={() => onDelete(vehicle.id)}
                title="Delete Vehicle Entry"
                className="py-1.5 px-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[11px] sm:text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline truncate">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
