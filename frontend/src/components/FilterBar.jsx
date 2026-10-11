import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown, SlidersHorizontal, Sparkles } from 'lucide-react';

const categories = ['All', 'Sedan', 'SUV', 'Truck', 'Electric', 'Coupe'];

const FilterBar = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 mb-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-stone-400" />
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Filter & Search — Prices in INR ₹
          </span>
        </div>
      </div>

      {/* Grid of Inputs & Action Button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
        {/* Maker / Brand Input */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1.5">
            Maker / Brand
          </label>
          <input
            type="text"
            placeholder="Toyota, BMW, Tesla..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a]/10 rounded-lg px-3 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-all outline-none"
          />
        </div>

        {/* Model Input */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1.5">
            Model
          </label>
          <input
            type="text"
            placeholder="Camry, M3, Model 3..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a]/10 rounded-lg px-3 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-all outline-none"
          />
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1.5">
            Category
          </label>
          <div className="relative">
            <select
              value={filters.category || 'All'}
              onChange={(e) => onFilterChange('category', e.target.value === 'All' ? '' : e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a]/10 rounded-lg pl-3 pr-8 py-2.5 text-sm text-stone-900 appearance-none cursor-pointer transition-all outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Year / Min Price Input */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1.5">
            Year
          </label>
          <input
            type="text"
            placeholder="e.g. 2024"
            value={filters.min_price || ''}
            onChange={(e) => onFilterChange('min_price', e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a]/10 rounded-lg px-3 py-2.5 text-sm text-stone-900 placeholder-stone-400 transition-all outline-none"
          />
        </div>

        {/* Sort By Select */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1.5">
            Sort By
          </label>
          <div className="relative">
            <select
              aria-label="Sort vehicles"
              value={filters.sort || 'default'}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a]/10 rounded-lg pl-3 pr-8 py-2.5 text-sm text-stone-900 appearance-none cursor-pointer transition-all outline-none"
            >
              <option value="default">Default (Newest)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Reset Button */}
        <div>
          <button
            onClick={onReset}
            className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold text-sm py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
