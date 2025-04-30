// src/hooks/use-auth.ts
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (e.g., check for token in localStorage)
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const logout = () => {
    // Clear the authentication token
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, logout };
};
