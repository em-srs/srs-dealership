import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

const categories = ['All', 'Sedan', 'SUV', 'Truck', 'Electric', 'Coupe'];

const FilterBar = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* General Search input */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search maker or model (e.g. Ford, Camry, Tesla)..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>

        {/* Category Select */}
        <div className="relative">
          <select
            value={filters.category || 'All'}
            onChange={(e) => onFilterChange('category', e.target.value === 'All' ? '' : e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900 text-white">
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl py-2.5 px-4 text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" />
          Reset Filters
        </button>
      </div>

      {/* Price Range inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/80">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Min Price (USD)</label>
          <input
            type="number"
            placeholder="0"
            value={filters.min_price || ''}
            onChange={(e) => onFilterChange('min_price', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Max Price (USD)</label>
          <input
            type="number"
            placeholder="No Limit"
            value={filters.max_price || ''}
            onChange={(e) => onFilterChange('max_price', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
