import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '@/lib/api'; // Import your axios instance
import axios from 'axios';

// Set the base URL for your backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type UserRole = 'farmer' | 'buyer' | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  village?: string;
  companyName?: string;
  plantLocation?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Added to handle initial check
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await api.post(`${API_URL}/auth/login`, {
        email,
        password,
        role
      });

      const { token, user: userData } = response.data;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return true;
    } catch (error: any) {
      console.error("Login Error:", error.response?.data?.message || error.message);
      return false;
    }
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      // Send all registration data to backend
      const response = await api.post(`${API_URL}/auth/register`, userData);

      const { token, user: registeredUser } = response.data;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(registeredUser));

      setUser(registeredUser);
      return true;
    } catch (error: any) {
      console.error("Registration Error:", error.response?.data?.message || error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      register, 
      logout 
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}