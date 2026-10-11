import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ShoppingCart, Edit, Trash2, PlusCircle, Calendar, Tag, ShieldCheck } from 'lucide-react';
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
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-stone-100">
        <img
          src={imageUrl}
          alt={`${vehicle.maker} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1">
          <Tag className="w-3 h-3 text-stone-500" />
          <span>{vehicle.category}</span>
        </div>

        {/* Stock Status */}
        <div
          className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 ${
            isOutOfStock
              ? 'bg-red-50 text-red-700 border border-red-200'
              : vehicle.quantity < 3
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOutOfStock
                ? 'bg-red-500'
                : vehicle.quantity < 3
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
          ></span>
          <span>{isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Available`}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title Row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-stone-900 font-display leading-tight">
              {vehicle.maker} {vehicle.model}
            </h3>
            <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded font-medium flex items-center gap-1 shrink-0">
              <Calendar className="w-3 h-3" />
              {vehicle.year}
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 pt-3 border-t border-stone-100">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Price</span>
            <p className="text-2xl font-extrabold text-[#0f172a] font-display mt-0.5">
              {formatINR(vehicle.price)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col gap-2">
          {/* Purchase Button */}
          <button
            onClick={() => onPurchase(vehicle.id)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-[#0f172a] hover:bg-[#1e293b] text-white active:scale-[0.98]'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Purchase Vehicle'}</span>
          </button>

          {/* Admin Controls */}
          {user && user.role === 'admin' && (
            <div className="grid grid-cols-3 gap-1.5 mt-0.5">
              <button
                onClick={() => onRestock(vehicle)}
                title="Restock Inventory"
                className="py-1.5 px-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
              >
                <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Restock</span>
              </button>
              <button
                onClick={() => onEdit(vehicle)}
                title="Edit Vehicle Entry"
                className="py-1.5 px-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
              >
                <Edit className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Edit</span>
              </button>
              <button
                onClick={() => onDelete(vehicle.id)}
                title="Delete Vehicle Entry"
                className="py-1.5 px-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
