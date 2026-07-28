import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VehicleCard from '../components/VehicleCard';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';

describe('VehicleCard Component', () => {
  const sampleVehicle = {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    category: 'Sedan',
    price: 26000.00,
    quantity: 3
  };

  it('renders vehicle details correctly', () => {
    render(<VehicleCard vehicle={sampleVehicle} onPurchase={() => {}} />);
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText(/26,000/)).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /purchase/i })).not.toBeDisabled();
  });

  it('disables purchase button when quantity is zero', () => {
    const zeroStockVehicle = { ...sampleVehicle, quantity: 0 };
    render(<VehicleCard vehicle={zeroStockVehicle} onPurchase={() => {}} />);
    const purchaseBtn = screen.getByRole('button', { name: /out of stock/i });
    expect(purchaseBtn).toBeDisabled();
  });
});

describe('Navbar Component', () => {
  it('renders brand title and auth options when logged out', () => {
    const authState = { user: null, logout: vi.fn() };
    render(
      <AuthContext.Provider value={authState}>
        <Navbar />
      </AuthContext.Provider>
    );
    expect(screen.getByText(/drivehub dealership/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('renders user details and logout button when logged in', () => {
    const authState = { user: { email: 'user@example.com', role: 'admin' }, logout: vi.fn() };
    render(
      <AuthContext.Provider value={authState}>
        <Navbar />
      </AuthContext.Provider>
    );
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});
