import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VehicleCard from '../components/VehicleCard';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';
import App from '../App';

describe('VehicleCard Component', () => {
  const sampleVehicle = {
    id: 1,
    maker: 'Toyota',
    model: 'Camry',
    year: 2023,
    category: 'Sedan',
    price: 26000.00,
    quantity: 5
  };

  it('renders vehicle maker, model, and price correctly', () => {
    const mockContext = { user: null };
    render(
      <AuthContext.Provider value={mockContext}>
        <VehicleCard vehicle={sampleVehicle} onPurchase={() => {}} />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('₹21,58,000')).toBeInTheDocument();
    expect(screen.queryByText('$26,000.00')).not.toBeInTheDocument();
    expect(screen.getByText('5 Available')).toBeInTheDocument();
  });

  it('disables purchase button when vehicle is out of stock', () => {
    const outOfStockVehicle = { ...sampleVehicle, quantity: 0 };
    const mockContext = { user: null };
    render(
      <AuthContext.Provider value={mockContext}>
        <VehicleCard vehicle={outOfStockVehicle} onPurchase={() => {}} />
      </AuthContext.Provider>
    );

    const button = screen.getByRole('button', { name: /Out of Stock/i });
    expect(button).toBeDisabled();
  });
});

describe('Navbar Component', () => {
  const mockFilters = { search: '', category: '', min_price: '', max_price: '' };

  it('renders brand title and login link for guest users', () => {
    const mockContext = { user: null, logout: () => {} };
    render(
      <AuthContext.Provider value={mockContext}>
        <Navbar filters={mockFilters} onFilterChange={() => {}} onResetFilters={() => {}} onOpenAuth={() => {}} onOpenProfile={() => {}} />
      </AuthContext.Provider>
    );

    expect(screen.getByText('DriveHub Dealership')).toBeInTheDocument();
    expect(screen.getByText('Login / Register')).toBeInTheDocument();
  });

  it('renders user avatar and email for logged in users', () => {
    const mockContext = { user: { email: 'admin@example.com', role: 'admin' }, logout: () => {} };
    render(
      <AuthContext.Provider value={mockContext}>
        <Navbar filters={mockFilters} onFilterChange={() => {}} onResetFilters={() => {}} onOpenAuth={() => {}} onOpenProfile={() => {}} />
      </AuthContext.Provider>
    );

    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});

describe('App Unauthenticated State', () => {
  it('displays public shop catalog view and filter bar for unauthenticated guest users', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, maker: 'Toyota', model: 'Camry', year: 2023, category: 'Sedan', price: 26000, quantity: 5 }
      ],
    });

    const mockContext = { user: null, token: null, logout: () => {} };
    render(
      <AuthContext.Provider value={mockContext}>
        <App />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Vehicle Inventory Catalog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Toyota, BMW/i)).toBeInTheDocument();
    expect(screen.queryByText('Authentication Required')).not.toBeInTheDocument();
  });
});

