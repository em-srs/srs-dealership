import React, { useState, useEffect, useContext } from 'react';
import Navbar from './components/Navbar';
import VehicleCard from './components/VehicleCard';
import AdminModal from './components/AdminModal';
import RestockModal from './components/RestockModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import AuthContext from './context/AuthContext';
import { Car, PlusCircle, AlertCircle, CheckCircle2, ShieldCheck, ArrowUp } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function App() {
  const { token, user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    min_price: '',
    max_price: '',
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [vehicleToRestock, setVehicleToRestock] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('q', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);

      const endpoint = params.toString()
        ? `${API_BASE}/vehicles/search?${params.toString()}`
        : `${API_BASE}/vehicles`;

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(endpoint, { headers });

      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
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
    setFilters({
      search: '',
      category: '',
      min_price: '',
      max_price: '',
    });
  };

  // Purchase vehicle endpoint
  const handlePurchase = async (vehicleId) => {
    if (!token) {
      setIsAuthModalOpen(true);
      showToast('Please log in to purchase vehicles.', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/vehicles/${vehicleId}/purchase`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        showToast('Vehicle purchased successfully!', 'success');
        fetchVehicles();
      } else {
        const errData = await res.json();
        showToast(errData.detail || 'Purchase failed.', 'error');
      }
    } catch (err) {
      showToast('Network error during purchase.', 'error');
    }
  };

  // Add / Edit vehicle endpoint
  const handleAdminSubmit = async (vehicleData) => {
    try {
      const url = vehicleToEdit
        ? `${API_BASE}/vehicles/${vehicleToEdit.id}`
        : `${API_BASE}/vehicles`;
      const method = vehicleToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (res.ok) {
        showToast(
          vehicleToEdit
            ? 'Vehicle updated successfully!'
            : 'New vehicle created successfully!',
          'success'
        );
        setIsAdminModalOpen(false);
        setVehicleToEdit(null);
        fetchVehicles();
      } else {
        const errData = await res.json();
        showToast(errData.detail || 'Operation failed.', 'error');
      }
    } catch (err) {
      showToast('Network error saving vehicle.', 'error');
    }
  };

  // Restock inventory endpoint
  const handleRestockSubmit = async (vehicleId, amount) => {
    try {
      const res = await fetch(
        `${API_BASE}/vehicles/${vehicleId}/restock?amount=${amount}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        showToast(`Added ${amount} units to inventory!`, 'success');
        setIsRestockModalOpen(false);
        setVehicleToRestock(null);
        fetchVehicles();
      } else {
        const errData = await res.json();
        showToast(errData.detail || 'Restock failed.', 'error');
      }
    } catch (err) {
      showToast('Network error during restock.', 'error');
    }
  };

  // Delete vehicle endpoint
  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle entry?'))
      return;

    try {
      const res = await fetch(`${API_BASE}/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        showToast('Vehicle entry deleted.', 'success');
        fetchVehicles();
      } else {
        const errData = await res.json();
        showToast(errData.detail || 'Delete failed.', 'error');
      }
    } catch (err) {
      showToast('Network error deleting vehicle.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce ${
            toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-800'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Top Bar (Navbar.jsx) */}
      <Navbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAddVehicle={() => {
          setVehicleToEdit(null);
          setIsAdminModalOpen(true);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Dashboard Grid Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Header Hero Area */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Vehicle Inventory Catalog
            </h1>
            <p className="mt-1 text-slate-400 text-xs sm:text-sm">
              Browse and manage vehicle inventory with real-time stock protection.
            </p>
          </div>

          {/* Admin-Only Control: "+ Add Vehicle" Button above the grid */}
          {user && user.role === 'admin' && (
            <button
              onClick={() => {
                setVehicleToEdit(null);
                setIsAdminModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              + Add Vehicle
            </button>
          )}
        </div>

        {/* Vehicles Card Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-slate-400 font-medium">
              Loading vehicle inventory...
            </p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center my-8">
            <Car className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-300">
              No Vehicles Found
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              No inventory entries match your search criteria. Try resetting your search filters or add a new vehicle entry.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                onPurchase={handlePurchase}
                onEdit={(veh) => {
                  setVehicleToEdit(veh);
                  setIsAdminModalOpen(true);
                }}
                onRestock={(veh) => {
                  setVehicleToRestock(veh);
                  setIsRestockModalOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          setVehicleToEdit(null);
        }}
        onSubmit={handleAdminSubmit}
        vehicleToEdit={vehicleToEdit}
      />

      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => {
          setIsRestockModalOpen(false);
          setVehicleToRestock(null);
        }}
        onSubmit={handleRestockSubmit}
        vehicle={vehicleToRestock}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
      />

      {/* Floating Smooth Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 p-3 bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl shadow-xl shadow-cyan-500/20 border border-cyan-400/30 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default App;
