'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'STAFF';
  phone?: string;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (token: string, user: UserSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('us_garment_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse user session', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token: string, userSession: UserSession) => {
    setUser(userSession);
    localStorage.setItem('us_garment_user', JSON.stringify(userSession));
    document.cookie = `garment_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    if (['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'].includes(userSession.role)) {
      document.cookie = `garment_admin_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('us_garment_user');
    document.cookie = 'garment_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'garment_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
