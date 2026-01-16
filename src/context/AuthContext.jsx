import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Try to load user from localStorage for persistence across reloads
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('asvian_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (role) => {
    // Mock user data based on role
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === 'admin' ? 'Sr. Gestor' : role === 'controller' ? 'Jefe de Mantenimiento' : 'ZARA Local 1',
      role: role,
      avatar: `https://ui-avatars.com/api/?name=${role}&background=random`
    };
    
    setUser(mockUser);
    localStorage.setItem('asvian_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('asvian_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
