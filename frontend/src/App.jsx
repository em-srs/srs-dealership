import React, { useState, useEffect, useContext } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import VehicleCard from './components/VehicleCard';
import AdminModal from './components/AdminModal';
import RestockModal from './components/RestockModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import PurchaseModal from './components/PurchaseModal';
import LandingPage from './components/LandingPage';
import AuthContext from './context/AuthContext';
import { getApiBase } from './utils/api';
import { sortVehicles } from './utils/sort';
import { formatINR } from './utils/currency';
import { Car, PlusCircle, AlertCircle, CheckCircle2, ShieldCheck, ArrowUp, Award, Layers, Lock, LogIn } from 'lucide-react';

const API_BASE = getApiBase();

function App() {
  const { token, user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog');
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

  /**
   * API CALL: Fetches vehicle inventory list from backend with active search and filter parameters.
   * Connected to: Backend GET /api/vehicles & GET /api/vehicles/search endpoints
   * Requires: User JWT Bearer Token, Filter state (search, category, min_price, max_price)
   */
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
      sort: 'default',
    });
  };



  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [vehicleToPurchase, setVehicleToPurchase] = useState(null);

  // Initiate purchase modal flow
  const handleInitiatePurchase = (vehicle) => {
    if (!token) {
      setIsAuthModalOpen(true);
      showToast('Please log in to purchase vehicles.', 'error');
      return;
    }
    setVehicleToPurchase(vehicle);
    setIsPurchaseModalOpen(true);
  };

  /**
   * API CALL: Submits purchase order details to backend for stock reduction and order creation.
   * Connected to: Backend POST /api/vehicles/{vehicleId}/purchase endpoint, PurchaseModal form
   * Requires: vehicleId integer, purchaseData object (buyer_name, phone, address, quantity), JWT Token
   */
  const handlePurchaseSubmit = async (vehicleId, purchaseData) => {
    try {
      const res = await fetch(`${API_BASE}/vehicles/${vehicleId}/purchase`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });

      if (res.ok) {
        showToast('Vehicle purchased successfully!', 'success');
        setIsPurchaseModalOpen(false);
        setVehicleToPurchase(null);
        fetchVehicles();
      } else {
        const errData = await res.json();
        showToast(errData.detail || 'Purchase failed.', 'error');
      }
    } catch (err) {
      showToast('Network error during purchase.', 'error');
    }
  };


  /**
   * API CALL: Creates a new vehicle (POST) or updates an existing vehicle (PUT) in inventory.
   * Connected to: Backend POST /api/vehicles & PUT /api/vehicles/{id} endpoints, AdminModal form
   * Requires: vehicleData object (maker, model, year, category, price, quantity), JWT Token
   */
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

  /**
   * API CALL: Restocks vehicle inventory quantity by calling backend restock endpoint (Admin).
   * Connected to: Backend POST /api/vehicles/{vehicleId}/restock?amount={amount} endpoint, RestockModal
   * Requires: vehicleId integer, restock amount integer, Admin JWT Token
   */
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

  /**
   * API CALL: Permanently deletes a vehicle entry from inventory database (Admin).
   * Connected to: Backend DELETE /api/vehicles/{vehicleId} endpoint, VehicleCard action button
   * Requires: vehicleId integer, Admin JWT Token
   */
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

  const totalBrands = new Set(vehicles.map((v) => v.maker || v.make).filter(Boolean)).size;
  const totalVehicles = vehicles.length;
  const totalCategories = new Set(vehicles.map((v) => v.category).filter(Boolean)).size;

  const handleInitiateEdit = (veh) => {
    if (!token) {
      setIsAuthModalOpen(true);
      showToast('Please log in to manage inventory.', 'error');
      return;
    }
    setVehicleToEdit(veh);
    setIsAdminModalOpen(true);
  };

  const handleInitiateRestock = (veh) => {
    if (!token) {
      setIsAuthModalOpen(true);
      showToast('Please log in to manage inventory.', 'error');
      return;
    }
    setVehicleToRestock(veh);
    setIsRestockModalOpen(true);
  };

  const handleInitiateDelete = (vehicleId) => {
    if (!token) {
      setIsAuthModalOpen(true);
      showToast('Please log in to manage inventory.', 'error');
      return;
    }
    handleDelete(vehicleId);
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
          if (!token) {
            setIsAuthModalOpen(true);
            showToast('Please log in to manage inventory.', 'error');
            return;
          }
          if (user && user.role !== 'admin') {
            showToast('Admin privileges required to manage inventory.', 'error');
            return;
          }
          setActiveTab('admin');
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Dashboard Grid Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Vehicles Content Area */}
        {activeTab === 'admin' && user && user.role === 'admin' ? (
          <div className="space-y-6">
            {/* Header Area matching user screenshot */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Admin Inventory Controls
                </h1>
                <p className="mt-1.5 text-slate-400 text-xs sm:text-sm">
                  Add, edit, restock, and delete vehicles in the inventory system.
                </p>
              </div>

              <button
                onClick={() => {
                  setVehicleToEdit(null);
                  setIsAdminModalOpen(true);
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer shrink-0 transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>+ Add New Vehicle</span>
              </button>
            </div>

            {/* Inventory Grouped by Brands / Makers */}
            {(() => {
              const grouped = vehicles.reduce((acc, v) => {
                const brand = v.maker || v.make || 'Other';
                if (!acc[brand]) acc[brand] = [];
                acc[brand].push(v);
                return acc;
              }, {});

              const brandNames = Object.keys(grouped).sort();

              if (brandNames.length === 0) {
                return (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 font-medium">
                    No vehicles in inventory. Click "+ Add New Vehicle" to add one.
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {brandNames.map((brand) => (
                    <div
                      key={brand}
                      className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md"
                    >
                      {/* Brand Group Header Banner */}
                      <div className="bg-slate-950/80 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                            <Car className="w-4 h-4" />
                          </div>
                          <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                            {brand}
                          </h2>
                          <span className="px-2.5 py-0.5 bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-bold text-[11px] rounded-full">
                            {grouped[brand].length} {grouped[brand].length === 1 ? 'Model' : 'Models'}
                          </span>
                        </div>

                        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                          Total Stock: {grouped[brand].reduce((sum, v) => sum + (v.quantity || 0), 0)} units
                        </span>
                      </div>

                      {/* Table of Models for this Brand */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                              <th className="py-3 px-5">Model</th>
                              <th className="py-3 px-5">Year</th>
                              <th className="py-3 px-5">Category</th>
                              <th className="py-3 px-5">Price</th>
                              <th className="py-3 px-5">Quantity</th>
                              <th className="py-3 px-5 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-slate-200">
                            {grouped[brand].map((v) => (
                              <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3.5 px-5 font-bold text-white">{v.model}</td>
                                <td className="py-3.5 px-5 text-slate-400 font-medium">{v.year}</td>
                                <td className="py-3.5 px-5 text-slate-400 font-medium">{v.category}</td>
                                <td className="py-3.5 px-5 font-bold text-emerald-400">
                                  {formatINR(v.price)}
                                </td>
                                <td className="py-3.5 px-5 font-semibold text-emerald-400">
                                  {v.quantity} units
                                </td>
                                <td className="py-3.5 px-5">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleInitiateEdit(v)}
                                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleInitiateRestock(v)}
                                      className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-800/80 transition-colors cursor-pointer"
                                    >
                                      Restock
                                    </button>
                                    <button
                                      onClick={() => handleInitiateDelete(v.id)}
                                      className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-400 text-xs font-semibold rounded-lg border border-rose-800/80 transition-colors cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        ) : (
          <>
            {/* Header Hero Area */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Vehicle Inventory Catalog
                </h1>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  <span className="text-slate-400 font-medium">Browse among</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-bold rounded-lg shadow-sm">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    {totalBrands} {totalBrands === 1 ? 'Brand' : 'Brands'}
                  </span>
                  <span className="text-slate-400 font-medium">in</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 font-bold rounded-lg shadow-sm">
                    <Car className="w-3.5 h-3.5 text-emerald-400" />
                    {totalVehicles} {totalVehicles === 1 ? 'Vehicle' : 'Vehicles'}
                  </span>
                  <span className="text-slate-400 font-medium">across</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-950/80 border border-purple-800/60 text-purple-300 font-bold rounded-lg shadow-sm">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    {totalCategories} {totalCategories === 1 ? 'Category' : 'Categories'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dedicated Search & Filter Bar Section */}
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />

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
                {sortVehicles(vehicles, filters.sort).map((v) => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    onPurchase={() => handleInitiatePurchase(v)}
                    onEdit={handleInitiateEdit}
                    onRestock={handleInitiateRestock}
                    onDelete={handleInitiateDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setVehicleToPurchase(null);
        }}
        onSubmit={handlePurchaseSubmit}
        vehicle={vehicleToPurchase}
      />

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
