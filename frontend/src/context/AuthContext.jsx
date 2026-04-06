import { createContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe } from '../api/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bicgn_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bicgn_token');
    if (token) {
      getMe()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('bicgn_user', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('bicgn_token');
          localStorage.removeItem('bicgn_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    const { access_token, user: userData } = res.data;
    localStorage.setItem('bicgn_token', access_token);
    localStorage.setItem('bicgn_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('bicgn_token');
    localStorage.removeItem('bicgn_user');
    setUser(null);
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    const hierarchy = { super_admin: 4, editeur: 3, validateur: 2, lecteur: 1 };
    return (hierarchy[user.role] || 0) >= (hierarchy[requiredRole] || 0);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}
