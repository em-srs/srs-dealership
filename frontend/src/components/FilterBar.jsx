import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown, SlidersHorizontal } from 'lucide-react';

const categories = ['All', 'Sedan', 'SUV', 'Truck', 'Electric', 'Coupe'];

const FilterBar = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-2xl mb-8">
      {/* Upper Sub-Header Bar */}
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800/80">
        <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
        <span className="text-[11px] font-extrabold tracking-wider text-indigo-400 uppercase">
          SEARCH & FILTER INVENTORY (PRICES IN INR ₹)
        </span>
      </div>

      {/* Grid of Inputs & Action Button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-end">
        {/* Maker / Brand Input */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
            Maker / Brand
          </label>
          <input
            type="text"
            placeholder="Toyota, BMW, Tesla..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Model Input */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
            Model
          </label>
          <input
            type="text"
            placeholder="Camry, M3, Model 3..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
            Category
          </label>
          <div className="relative">
            <select
              value={filters.category || 'All'}
              onChange={(e) => onFilterChange('category', e.target.value === 'All' ? '' : e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-xs text-white appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Year / Min Price Input */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
            Year
          </label>
          <input
            type="text"
            placeholder="e.g. 2024"
            value={filters.min_price || ''}
            onChange={(e) => onFilterChange('min_price', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Sort By Select */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
            Sort By
          </label>
          <div className="relative">
            <select
              aria-label="Sort vehicles"
              value={filters.sort || 'default'}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-xs text-white appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer text-ellipsis overflow-hidden"
            >
              <option value="default" className="bg-slate-900 text-white">Default (Newest)</option>
              <option value="price_asc" className="bg-slate-900 text-white">Price: Low to High</option>
              <option value="price_desc" className="bg-slate-900 text-white">Price: High to Low</option>
              <option value="newest" className="bg-slate-900 text-white">Newest First</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Action Button: Filter & Sort */}
        <div>
          <button
            onClick={onReset}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-white" />
            Filter & Sort
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
