/**
 * Determines and returns the backend API base URL dynamically based on environment settings or hostname.
 * Connected to: Backend API Server (http://localhost:8000/api or production Render endpoint)
 * Requires: VITE_API_BASE_URL environment variable or window.location.hostname
 */

export const getApiBase = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return 'https://drivehub-dealership.onrender.com/api';
    }
  }
  return 'http://localhost:8000/api';
};

