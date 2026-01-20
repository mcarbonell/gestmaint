import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Try to load user from localStorage for persistence across reloads
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('asvian_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem('asvian_all_users');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'admin', name: 'Gestoría Administrador', role: 'admin', email: 'admin@asvian.com' },
      { id: 'controller', name: 'Jefe de Mantenimiento', role: 'controller', email: 'mantenimiento@asvian.com' },
      { id: 'local1', name: 'ZARA Local 1', role: 'local', email: 'zara@asvian.com' },
      { id: 'local2', name: 'H&M', role: 'local', email: 'hm@asvian.com' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('asvian_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  const login = (roleOrEmail) => {
    const foundUser = allUsers.find(u => u.role === roleOrEmail || u.email === roleOrEmail);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('asvian_user', JSON.stringify(foundUser));
    }
  };

  const addUser = (newUser) => {
    const userWithId = { ...newUser, id: Math.random().toString(36).substr(2, 9) };
    setAllUsers([...allUsers, userWithId]);
    return userWithId;
  };

  const deleteUser = (id) => {
    setAllUsers(allUsers.filter(u => u.id !== id));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('asvian_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      allUsers,
      login,
      logout,
      addUser,
      deleteUser,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
