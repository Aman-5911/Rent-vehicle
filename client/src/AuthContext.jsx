import { createContext, useContext, useEffect, useState } from 'react';
import { api, refreshAccessToken, setAccessToken } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    refreshAccessToken()
      .then((session) => active && setUser(session.user))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  async function signIn(credentials) {
    const session = await api('/auth/login', { method: 'POST', body: credentials, public: true });
    setAccessToken(session.accessToken);
    setUser(session.user);
    return session.user;
  }

  async function signUp(details) {
    const session = await api('/auth/register', { method: 'POST', body: details, public: true });
    setAccessToken(session.accessToken);
    setUser(session.user);
    return session.user;
  }

  async function signOut() {
    await api('/auth/logout', { method: 'POST' }).catch(() => null);
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}