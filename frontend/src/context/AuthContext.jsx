import React, { createContext, useState, useEffect } from 'react';
import { getApiBase } from '../utils/api';

export const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

/**
 * Decodes and parses a JWT payload string to extract claims (subject, role, expiration).
 * Connected to: LocalStorage JWT token storage
 * Requires: Standard base64 JWT token string
 */
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      const payload = parseJwt(savedToken);
      if (payload && payload.exp * 1000 > Date.now()) {
        return {
          email: payload.sub,
          role: payload.role,
          id: payload.id,
        };
      }
    }
    return null;
  });

  useEffect(() => {
    if (token) {
      const payload = parseJwt(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser({
          email: payload.sub,
          role: payload.role,
          id: payload.id,
        });
      } else {
        logout();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const API_BASE = getApiBase();

  /**
   * API CALL: Sends user login credentials to backend and saves received JWT access token.
   * Connected to: Backend POST /api/auth/login endpoint, AuthModal form
   * Requires: User email and password strings
   */
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }

    const data = await res.json();
    localStorage.setItem('token', data.access_token);
    
    // Parse payload and update state immediately upon successful response
    const payload = parseJwt(data.access_token);
    if (payload) {
      setUser({
        email: payload.sub,
        role: payload.role,
        id: payload.id,
      });
    }
    setToken(data.access_token);
    return data;
  };

  /**
   * API CALL: Sends new user registration details to backend for account creation.
   * Connected to: Backend POST /api/auth/register endpoint, AuthModal form
   * Requires: User email, password, and optional role ('user' or 'admin')
   */
  const register = async (email, password, role = 'user') => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }

    return await res.json();
  };

  /**
   * Clears saved token from local storage and resets user authentication state.
   * Connected to: Navbar Logout button
   * Requires: None
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
