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
import ContactSection from './components/ContactSection';
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
    <div className="min-h-screen flex flex-col font-sans relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg border shadow-lg flex items-center gap-2.5 transition-all duration-300 ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-500" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Navbar */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Admin Tab */}
        {activeTab === 'admin' && user && user.role === 'admin' ? (
          <div className="space-y-6">
            {/* Admin Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
                  Admin Inventory Controls
                </h1>
                <p className="mt-1 text-stone-500 text-sm">
                  Add, edit, restock, and delete vehicles in the inventory system.
                </p>
              </div>

              <button
                onClick={() => {
                  setVehicleToEdit(null);
                  setIsAdminModalOpen(true);
                }}
                className="px-5 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold text-sm rounded-lg flex items-center gap-2 cursor-pointer shrink-0 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Vehicle</span>
              </button>
            </div>

            {/* Inventory Grouped by Brands */}
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
                  <div className="bg-white border border-stone-200 rounded-xl p-12 text-center text-stone-500">
                    No vehicles in inventory. Click "Add New Vehicle" to add one.
                  </div>
                );
              }

              return (
                <div className="space-y-5">
                  {brandNames.map((brand) => (
                    <div
                      key={brand}
                      className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm"
                    >
                      {/* Brand Header */}
                      <div className="bg-stone-50 px-5 py-3.5 border-b border-stone-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center text-white">
                            <Car className="w-4 h-4" />
                          </div>
                          <h2 className="text-sm font-bold text-stone-900 font-display">
                            {brand}
                          </h2>
                          <span className="px-2 py-0.5 bg-stone-200 text-stone-600 font-semibold text-xs rounded-md">
                            {grouped[brand].length} {grouped[brand].length === 1 ? 'Model' : 'Models'}
                          </span>
                        </div>

                        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                          Total Stock: <span className="text-stone-800 font-bold">{grouped[brand].reduce((sum, v) => sum + (v.quantity || 0), 0)}</span> units
                        </span>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-stone-100 bg-stone-50/50 text-stone-500 text-xs font-semibold uppercase tracking-wider">
                              <th className="py-3 px-5">Model</th>
                              <th className="py-3 px-5">Year</th>
                              <th className="py-3 px-5">Category</th>
                              <th className="py-3 px-5">Price</th>
                              <th className="py-3 px-5">Quantity</th>
                              <th className="py-3 px-5 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100 text-stone-700">
                            {grouped[brand].map((v) => (
                              <tr key={v.id} className="hover:bg-stone-50 transition-colors">
                                <td className="py-3.5 px-5 font-semibold text-stone-900 font-display">{v.model}</td>
                                <td className="py-3.5 px-5 text-stone-500">{v.year}</td>
                                <td className="py-3.5 px-5">
                                  <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-xs font-medium">
                                    {v.category}
                                  </span>
                                </td>
                                <td className="py-3.5 px-5 font-bold text-stone-900">
                                  {formatINR(v.price)}
                                </td>
                                <td className="py-3.5 px-5 font-semibold text-stone-700">
                                  {v.quantity} units
                                </td>
                                <td className="py-3.5 px-5">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleInitiateEdit(v)}
                                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleInitiateRestock(v)}
                                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200 transition-colors cursor-pointer"
                                    >
                                      Restock
                                    </button>
                                    <button
                                      onClick={() => handleInitiateDelete(v.id)}
                                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-md border border-red-200 transition-colors cursor-pointer"
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
            {/* Catalog Header */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
                  Vehicle Inventory Catalog
                </h1>
                <p className="mt-1.5 text-stone-500 text-sm">
                  Browse our curated inventory of premium vehicles
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <span className="inline-flex items-center gap-1.5 text-stone-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#0f172a]"></span>
                  {totalBrands} {totalBrands === 1 ? 'Brand' : 'Brands'}
                </span>
                <span className="text-stone-300">·</span>
                <span className="inline-flex items-center gap-1.5 text-stone-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  {totalVehicles} {totalVehicles === 1 ? 'Vehicle' : 'Vehicles'}
                </span>
                <span className="text-stone-300">·</span>
                <span className="inline-flex items-center gap-1.5 text-stone-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {totalCategories} {totalCategories === 1 ? 'Category' : 'Categories'}
                </span>
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-10 h-10 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-stone-500">
                  Loading inventory...
                </p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-xl p-12 text-center my-8 max-w-md mx-auto shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 font-display">
                  No Vehicles Found
                </h3>
                <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">
                  No inventory entries match your search criteria. Try resetting your filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 px-5 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
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

      {/* Contact Section at bottom of Home / Catalog page */}
      {activeTab === 'catalog' && <ContactSection />}

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

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 p-3 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
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
