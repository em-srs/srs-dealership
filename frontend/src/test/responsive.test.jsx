import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';

describe('Navbar Mobile Responsiveness & Hamburger Toggle', () => {
  const mockFilters = { search: '', category: '', min_price: '', max_price: '', sort: 'default' };

  it('renders a mobile menu toggle button and toggles expanded filter menu visibility', () => {
    const mockContext = { user: null, logout: () => {} };

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

    // Find mobile menu toggle button (hamburger)
    const toggleButton = screen.getByRole('button', { name: /toggle mobile menu|filter controls/i });
    expect(toggleButton).toBeInTheDocument();

    // Mobile filter panel should initially be hidden (collapsed)
    expect(screen.queryByTestId('mobile-filter-panel')).not.toBeInTheDocument();

    // Click toggle button to expand
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('mobile-filter-panel')).toBeInTheDocument();

    // Click toggle button again to collapse
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId('mobile-filter-panel')).not.toBeInTheDocument();
  });
});
