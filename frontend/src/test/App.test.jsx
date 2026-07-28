import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VehicleCard from '../components/VehicleCard';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';

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
    expect(screen.getByText('$26,000.00')).toBeInTheDocument();
    expect(screen.getByText('5 In Stock')).toBeInTheDocument();
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
  it('renders brand title and login link for guest users', () => {
    const mockContext = { user: null, logout: () => {} };
    render(
      <AuthContext.Provider value={mockContext}>
        <Navbar onOpenAuth={() => {}} onOpenAddVehicle={() => {}} />
      </AuthContext.Provider>
    );

    expect(screen.getByText('DriveHub Dealership')).toBeInTheDocument();
    expect(screen.getByText('Login / Register')).toBeInTheDocument();
  });

  it('renders Admin badge and Add Vehicle button for admin users', () => {
    const mockContext = { user: { email: 'admin@example.com', role: 'admin' }, logout: () => {} };
    render(
      <AuthContext.Provider value={mockContext}>
        <Navbar onOpenAuth={() => {}} onOpenAddVehicle={() => {}} />
      </AuthContext.Provider>
    );

    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('+ Add Vehicle')).toBeInTheDocument();
  });
});
