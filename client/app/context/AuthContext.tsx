// client/app/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLazyQuery } from '@apollo/client';
import { ME_QUERY } from '../lib/graphql/queries/me';

// Define the shape of the user object
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define the shape of our context's state
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // REFACTORED: We get 'data' and 'error' back from the hook directly
  const [getMe, { data, error }] = useLazyQuery(ME_QUERY);

  // This useEffect still runs on initial load to start the process
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      getMe(); // Call the 'me' query if we find a token
    } else {
      setLoading(false);
    }
  }, [getMe]);

  // REFACTORED: This new useEffect "reacts" to the result of our 'getMe' query
  useEffect(() => {
    // This code runs whenever the 'data' or 'error' variables change
    if (data && data.me) {
      // If the query was successful, set the user state
      setUser(data.me);
      setToken(localStorage.getItem('authToken'));
      setLoading(false);
    } else if (error) {
      // If the query failed (e.g., bad token), clear the state
      localStorage.removeItem('authToken');
      setLoading(false);
    }
  }, [data, error]); // This hook's dependency array

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, loading, login, logout };

  if (loading) {
    return <p>Authenticating...</p>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}