import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function RequireAuth({ roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-24 text-center text-slate-500">Checking your session…</main>;
  if (!user) return <Navigate to="/login" replace state={{ returnTo: `${location.pathname}${location.search}` }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}