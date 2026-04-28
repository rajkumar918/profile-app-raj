import React, { createContext, useState, useContext } from 'react';

// Simplified AuthContext: no login requirement. Provides a lightweight user object
// stored in localStorage under `user`. This removes the previous login flow while
// keeping compatibility for components that call `useAuth()`.

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const initialUser = stored ? JSON.parse(stored) : { name: 'Candidate' };
  const [user, setUser] = useState(initialUser);

  const login = (email) => {
    const u = { email, name: email ? email.split('@')[0] : 'Candidate' };
    setUser(u);
    try { localStorage.setItem('user', JSON.stringify(u)); } catch (e) { }
  };

  const logout = () => {
    setUser({ name: 'Candidate' });
    try { localStorage.removeItem('user'); } catch (e) { }
  };

  const isAuthenticated = () => true; // always allow access

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
