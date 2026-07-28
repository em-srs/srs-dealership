import React from 'react';
import { Search, Filter, RotateCcw, DollarSign } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange, onReset }) => {
  const categories = ['All', 'Sedan', 'SUV', 'Truck', 'Electric', 'Coupe'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
      <div className="flex items-center gap-2 mb-4 text-slate-300 font-semibold text-sm">
        <Filter className="w-4 h-4 text-cyan-400" />
        Filter & Search Inventory
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Make/Model */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search make or model..."
            value={filters.make || ''}
            onChange={(e) => onFilterChange('make', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>

        {/* Category Selector */}
        <div>
          <select
            value={filters.category || 'All'}
            onChange={(e) => onFilterChange('category', e.target.value === 'All' ? '' : e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
          >
            <option value="All">All Categories</option>
            {categories.filter((c) => c !== 'All').map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div className="relative">
          <DollarSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="number"
            placeholder="Min Price"
            value={filters.min_price || ''}
            onChange={(e) => onFilterChange('min_price', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>

        {/* Max Price */}
        <div className="relative">
          <DollarSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.max_price || ''}
            onChange={(e) => onFilterChange('max_price', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-cyan-400 font-medium flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
