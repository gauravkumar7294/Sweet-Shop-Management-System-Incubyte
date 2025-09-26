import React, { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    // This effect runs whenever the token changes.
    // It decodes the token to get the user's info and updates the state.
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.userId, email: payload.email, role: payload.role });
      } catch (e) {
        console.error("Invalid token:", e);
        logout(); // If the token is invalid, log the user out.
      }
    } else {
        setUser(null);
    }
  }, [token]);

  // Function to update the state upon a successful login
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Function to clear the state upon logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // The AuthProvider makes the user, token, login, and logout functions
  // available to any child component that needs them.
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
