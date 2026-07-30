import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';

describe('Navbar Mobile Responsiveness & Hamburger Toggle', () => {
  const mockFilters = { search: '', category: '', min_price: '', max_price: '', sort: 'default' };

  it('toggles mobile navigation drawer with user actions and does NOT render duplicate search panel', () => {
    const mockContext = { user: { email: 'admin@dealership.com', role: 'admin' }, logout: () => {} };

    render(
      <AuthContext.Provider value={mockContext}>
        <Navbar
          filters={mockFilters}
          onFilterChange={() => {}}
          onResetFilters={() => {}}
          onOpenAuth={() => {}}
          onOpenProfile={() => {}}
        />
      </AuthContext.Provider>
    );

    // Mobile menu toggle button (hamburger)
    const toggleButton = screen.getByRole('button', { name: /toggle mobile menu|navigation/i });
    expect(toggleButton).toBeInTheDocument();

    // Mobile navigation menu should initially be collapsed
    expect(screen.queryByTestId('mobile-nav-menu')).not.toBeInTheDocument();

    // Click hamburger button to open drawer
    fireEvent.click(toggleButton);

    // Mobile drawer should be open
    const drawer = screen.getByTestId('mobile-nav-menu');
    expect(drawer).toBeInTheDocument();

    // Should render navigation actions (Manage Inventory, Logout)
    expect(screen.getAllByText('Manage Inventory').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Logout').length).toBeGreaterThan(0);

    // Should NOT render duplicate search/filter inputs inside navbar
    expect(screen.queryByTestId('mobile-filter-panel')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Search maker or model...')).not.toBeInTheDocument();

    // Click toggle button again to collapse
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId('mobile-nav-menu')).not.toBeInTheDocument();
  });
});
