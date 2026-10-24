import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Car, ShieldCheck } from 'lucide-react';
import { useAuth } from '../AuthContext';

const fieldClass = 'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export default function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) await signUp(form);
      else await signIn({ email: form.email, password: form.password });
      const returnTo = location.state?.returnTo;
      navigate(returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Car className="h-5 w-5" /></div>
          <div>
            <p className="text-sm font-semibold text-blue-700">RentWheels</p>
            <p className="text-xs text-slate-500">{isRegister ? 'Create your account' : 'Welcome back'}</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{isRegister ? 'Join RentWheels' : 'Sign in'}</h1>
        <p className="mt-2 text-sm text-slate-600">{isRegister ? 'Book trusted cars or share your vehicle with local drivers.' : 'Manage your trips, saved vehicles, and listings.'}</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          {isRegister && <>
            <label className="block text-sm font-medium text-slate-700">Full name<input className={fieldClass} name="fullName" autoComplete="name" value={form.fullName} onChange={update} required minLength={2} /></label>
            <label className="block text-sm font-medium text-slate-700">Phone number<input className={fieldClass} name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" value={form.phone} onChange={update} required /></label>
            <label className="block text-sm font-medium text-slate-700">Account type<select className={fieldClass} name="role" value={form.role} onChange={update}><option value="customer">I want to rent vehicles</option><option value="owner">I want to list my vehicle</option></select></label>
          </>}
          <label className="block text-sm font-medium text-slate-700">Email<input className={fieldClass} name="email" type="email" autoComplete="email" value={form.email} onChange={update} required /></label>
          <label className="block text-sm font-medium text-slate-700">Password<input className={fieldClass} name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={form.password} onChange={update} required minLength={isRegister ? 8 : undefined} /></label>
          {isRegister && <p className="-mt-2 flex items-start gap-2 text-xs text-slate-500"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />Use at least 8 characters with uppercase, lowercase, a number, and a symbol.</p>}
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>}
          <button disabled={submitting} className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">
            {submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isRegister ? 'Already have an account? ' : 'New to RentWheels? '}
          <Link className="font-semibold text-blue-700 hover:text-blue-800" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link>
        </p>
      </div>
    </main>
  );
}