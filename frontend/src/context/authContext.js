import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // For now, we'll assume the token is valid and just set a dummy user
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Basic JWT decode
        setUser({ id: decodedToken.id, role: decodedToken.role });
      } catch (error) {
        console.error('Failed to decode token:', error);
        setToken(null);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      // Re-decode the new token to get user info
      const decodedToken = JSON.parse(atob(newToken.split('.')[1]));
      setUser({ id: decodedToken.id, role: decodedToken.role });
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await registerUser({ name, email, password, role });
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      const decodedToken = JSON.parse(atob(newToken.split('.')[1]));
      setUser({ id: decodedToken.id, role: decodedToken.role });
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
