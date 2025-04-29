// src/hooks/use-auth.ts
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (e.g., check for token in localStorage)
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const logout = () => {
    // Clear the authentication token
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, logout };
};
