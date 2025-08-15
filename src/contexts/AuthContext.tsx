"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, setAccessToken, setRefreshToken, getRefreshToken, clearTokens } from '@/lib/api';

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

  // Initialize auth state by checking localStorage and refresh token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initAuth = async () => {
        try {
          // Check if we have a refresh token
          const refreshToken = getRefreshToken();
          
          if (refreshToken) {
            // Try to refresh the access token
            try {
              const response = await api.auth.refresh();
              const { user: userData } = response;
              
              if (userData) {
                setUser(userData);
                localStorage.setItem('userData', JSON.stringify(userData));
              }
            } catch (error) {
              // Refresh failed, clear tokens
              console.log('Token refresh failed:', error);
              clearTokens();
              localStorage.removeItem('userData');
              setUser(null);
            }
          } else {
            // No refresh token, check if we have stored user data
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
              // Clear it since we don't have tokens
              localStorage.removeItem('userData');
            }
            setUser(null);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          setUser(null);
        } finally {
          setIsInitialized(true);
          setLoading(false);
        }
      };
      
      initAuth();
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.auth.login(email, password);
    // response already contains user, accessToken, and refreshToken
    // tokens are already stored by the api.auth.login method
    const { user: userData } = response;
    
    // Store user data in localStorage for UI
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Update state immediately
    setUser(userData);
    
    // Small delay to ensure everything is set before navigation
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear tokens and localStorage (tokens are cleared by api.auth.logout)
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