"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface UserData {
  id: string;
  username: string;
  email: string;
  [key: string]: any;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: UserData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state by checking if user is authenticated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAuth = async () => {
        try {
          // Try to get current user (cookie will be sent automatically)
          const userData = await api.user.getProfile();
          if (userData) {
            setUser(userData);
            localStorage.setItem('userData', JSON.stringify(userData));
          }
        } catch (error: any) {
          // Not authenticated - this is normal for logged out users
          console.log('Auth check:', error?.message || 'Not authenticated');
          localStorage.removeItem('userData');
          setUser(null);
        } finally {
          setIsInitialized(true);
          setLoading(false);
        }
      };
      
      checkAuth();
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.auth.login(email, password);
    // response is already the data (not wrapped)
    const { user: userData } = response;
    
    // Store user data in localStorage for UI
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Update state immediately
    setUser(userData);
    
    // Small delay to ensure cookies are set before navigation
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const logout = async () => {
    try {
      // Call logout endpoint (cookies are sent automatically)
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear localStorage
    localStorage.removeItem('userData');
    
    // Clear state
    setUser(null);
    
    // Redirect to login
    router.push('/login');
  };

  const updateUser = (userData: UserData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
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