import React, { useState, useEffect, useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import VehicleCard from './components/VehicleCard';
import FilterBar from './components/FilterBar';
import AdminModal from './components/AdminModal';
import AuthModal from './components/AuthModal';
import RestockModal from './components/RestockModal';
import { Car, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

const MainApp = () => {
  const { token, user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ make: '', category: '', min_price: '', max_price: '' });

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8000/api/vehicles/search';
      const params = new URLSearchParams();

      if (filters.make) params.append('make', filters.make);
      if (filters.category) params.append('category', filters.category);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);

      if (params.toString()) {
        url += `?${params.toString()}`;
      } else {
        url = 'http://localhost:8000/api/vehicles';
      }

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(url, { headers });

      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [filters, token]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ make: '', category: '', min_price: '', max_price: '' });
  };

  // Purchase Vehicle
  const handlePurchase = async (vehicleId) => {
    if (!token) {
      setIsAuthModalOpen(true);
      showNotification('Please log in to purchase vehicles', 'error');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/vehicles/${vehicleId}/purchase`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Purchase failed');
      }

      showNotification('Vehicle purchased successfully!');
      fetchVehicles();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Admin Add / Edit
  const handleSaveVehicle = async (vehicleData) => {
    try {
      const isEdit = Boolean(selectedVehicle);
      const url = isEdit
        ? `http://localhost:8000/api/vehicles/${selectedVehicle.id}`
        : 'http://localhost:8000/api/vehicles';

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehicleData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to save vehicle');
      }

      showNotification(isEdit ? 'Vehicle updated successfully!' : 'New vehicle added to inventory!');
      setIsAdminModalOpen(false);
      setSelectedVehicle(null);
      fetchVehicles();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Admin Delete
  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle entry?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to delete vehicle');
      }

      showNotification('Vehicle deleted from inventory');
      fetchVehicles();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Admin Restock
  const handleRestockSubmit = async (vehicleId, amount) => {
    try {
      const res = await fetch(`http://localhost:8000/api/vehicles/${vehicleId}/restock?amount=${amount}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to restock vehicle');
      }

      showNotification(`Restocked ${amount} units successfully!`);
      setIsRestockModalOpen(false);
      setSelectedVehicle(null);
      fetchVehicles();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAddVehicleModal={() => {
          setSelectedVehicle(null);
          setIsAdminModalOpen(true);
        }}
      />

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border text-sm font-medium flex items-center gap-2.5 transition-all animate-bounce ${
            notification.type === 'error'
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}
        >
          {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          {notification.msg}
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800/80 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs px-3.5 py-1.5 rounded-full font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Full-Stack TDD Car Inventory System
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Explore Our Featured <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Dealership Vehicles
              </span>
            </h2>
            <p className="mt-3 text-slate-400 text-sm md:text-base max-w-xl">
              Browse top quality sedans, SUVs, trucks, and electric vehicles. Log in to manage orders or restock inventory as an administrator.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 text-sm">Loading vehicle inventory...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8">
            <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-200">No Vehicles Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No inventory entries matched your search criteria. Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onPurchase={handlePurchase}
                onEdit={(v) => {
                  setSelectedVehicle(v);
                  setIsAdminModalOpen(true);
                }}
                onDelete={handleDeleteVehicle}
                onRestock={(v) => {
                  setSelectedVehicle(v);
                  setIsRestockModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSubmit={handleSaveVehicle}
        vehicleToEdit={selectedVehicle}
      />
      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        vehicle={selectedVehicle}
        onRestockSubmit={handleRestockSubmit}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        Car Dealership Inventory System — TDD Kata Project
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
