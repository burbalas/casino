// src/contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => { setAuthToken(token); }, []); // initialize from storage

  const login  = (jwt) => {
    setToken(jwt);
    localStorage.setItem('token', jwt);
    setAuthToken(jwt);
  };
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
