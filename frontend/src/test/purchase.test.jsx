import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import App from '../App';
import AuthContext from '../context/AuthContext';
import PurchaseModal from '../components/PurchaseModal';
import ProfileModal from '../components/ProfileModal';

describe('Purchase History & Checkout Form Flow', () => {
  const mockUser = {
    id: 1,
    email: 'buyer@example.com',
    role: 'user',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders PurchaseModal with form fields when vehicle purchase is initiated', () => {
    const mockVehicle = {
      id: 10,
      maker: 'BMW',
      model: 'M3',
      year: 2024,
      category: 'Sports',
      price: 75000,
      quantity: 3,
    };

    const handleClose = vi.fn();
    const handleSubmit = vi.fn();

    render(
      <PurchaseModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        vehicle={mockVehicle}
      />
    );

    expect(screen.getByText(/Complete Vehicle Purchase/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Delivery Address/i)).toBeInTheDocument();
  });

  it('submits purchase form data correctly', async () => {
    const mockVehicle = {
      id: 10,
      maker: 'BMW',
      model: 'M3',
      year: 2024,
      category: 'Sports',
      price: 75000,
      quantity: 3,
    };

    const handleSubmit = vi.fn();

    render(
      <PurchaseModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={handleSubmit}
        vehicle={mockVehicle}
      />
    );

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Alice Smith' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '555-0199' },
    });
    fireEvent.change(screen.getByLabelText(/Delivery Address/i), {
      target: { value: '123 Main St' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Confirm Purchase/i }));

    expect(handleSubmit).toHaveBeenCalledWith(10, {
      buyer_name: 'Alice Smith',
      buyer_phone: '555-0199',
      delivery_address: '123 Main St',
      note: '',
      quantity: 1,
    });
  });

  it('renders user purchase history in ProfileModal', async () => {
    const mockPurchases = [
      {
        id: 1,
        vehicle_maker: 'Porsche',
        vehicle_model: '911',
        quantity: 1,
        price_at_purchase: 120000,
        purchased_at: '2026-07-30T10:00:00Z',
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPurchases,
    });

    render(
      <AuthContext.Provider value={{ token: 'mock-token', user: mockUser }}>
        <ProfileModal isOpen={true} onClose={() => {}} user={mockUser} />
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText(/Purchase History/i));

    await waitFor(() => {
      expect(screen.getByText(/Porsche 911/i)).toBeInTheDocument();
    });

  });
});
