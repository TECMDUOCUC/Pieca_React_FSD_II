import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, getToken, setToken, clearToken } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!getToken()) { setLoading(false); return; }
      try {
        const me = await apiFetch('/api/auth/me');
        if (alive) setUser(me);
      } catch {
        clearToken();
      } finally {
        if (alive) setLoading(false);
      }
    })();

    const onUnauthorized = () => setUser(null);
    window.addEventListener('pieca:unauthorized', onUnauthorized);
    return () => {
      alive = false;
      window.removeEventListener('pieca:unauthorized', onUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    const res = await apiFetch('/api/auth/login', { method: 'POST', body: { email, password }, auth: false });
    setToken(res.token);
    setUser(res);
    return res;
  };

  const register = async (payload) => {
    const res = await apiFetch('/api/auth/register', { method: 'POST', body: payload, auth: false });
    setToken(res.token);
    setUser(res);
    return res;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const role = user?.role;
  const value = {
    user, loading, login, register, logout,
    isAdmin: role === 'ROLE_ADMIN',
    isSeller: role === 'ROLE_SELLER',
    isStaff: role === 'ROLE_ADMIN' || role === 'ROLE_SELLER',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);