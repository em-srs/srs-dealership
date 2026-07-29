import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { sortVehicles } from '../utils/sort';
import FilterBar from '../components/FilterBar';

describe('sortVehicles Utility', () => {
  const sampleVehicles = [
    { id: 1, maker: 'Toyota', model: 'Camry', price: 26000, year: 2021 },
    { id: 2, maker: 'Tesla', model: 'Model 3', price: 42000, year: 2024 },
    { id: 3, maker: 'Honda', model: 'Civic', price: 20000, year: 2023 },
  ];

  it('sorts vehicles by price low to high (price_asc)', () => {
    const result = sortVehicles(sampleVehicles, 'price_asc');
    expect(result.map(v => v.model)).toEqual(['Civic', 'Camry', 'Model 3']);
  });

  it('sorts vehicles by price high to low (price_desc)', () => {
    const result = sortVehicles(sampleVehicles, 'price_desc');
    expect(result.map(v => v.model)).toEqual(['Model 3', 'Camry', 'Civic']);
  });

  it('sorts vehicles by newest year (newest)', () => {
    const result = sortVehicles(sampleVehicles, 'newest');
    expect(result.map(v => v.model)).toEqual(['Model 3', 'Civic', 'Camry']);
  });
});

describe('FilterBar Sorting Control', () => {
  it('renders sort select input and triggers onFilterChange on select', () => {
    let currentFilters = { sort: 'default' };
    const handleFilterChange = (key, value) => {
      currentFilters[key] = value;
    };

    render(
      <FilterBar
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        onReset={() => {}}
      />
    );

    const sortSelect = screen.getByRole('combobox', { name: /sort/i });
    expect(sortSelect).toBeInTheDocument();
    
    fireEvent.change(sortSelect, { target: { value: 'price_asc' } });
    expect(currentFilters.sort).toBe('price_asc');
  });
});
