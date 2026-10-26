import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Heart, MapPin } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { api } from '../api';
import { useAuth } from '../AuthContext';

function dateLabel(value) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([
      api('/bookings/mine'),
      api('/favorites'),
      user.role === 'owner' ? api('/vehicles/mine') : Promise.resolve({ vehicles: [] }),
    ]).then(([bookingResult, favoriteResult, vehicleResult]) => {
      if (!active) return;
      setBookings(bookingResult.bookings || []);
      setFavorites(favoriteResult.vehicles || []);
      setVehicles(vehicleResult.vehicles || []);
    }).catch((requestError) => active && setError(requestError.message));
    return () => { active = false; };
  }, [user]);

  async function cancelBooking(id) {
    try {
      const result = await api(`/bookings/${id}/cancel`, { method: 'PATCH' });
      setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, status: result.booking.status } : booking));
      setNotice('Booking cancelled. The dates are available again.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function removeFavorite(id) {
    try {
      await api(`/favorites/${id}`, { method: 'DELETE' });
      setFavorites((current) => current.filter((vehicle) => vehicle.id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold capitalize text-blue-700">{user.role} dashboard</p><h1 className="mt-1 text-3xl font-bold">Hello, {user.fullName.split(' ')[0]}</h1><p className="mt-2 text-sm text-slate-600">Your account, trips, and saved vehicles.</p></div><div className="flex gap-2"><Link to="/list-vehicle" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">List a vehicle</Link><button onClick={signOut} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Sign out</button></div></div>
        {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">{notice}</p>}

        <section className="mt-8"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Your bookings</h2><span className="text-sm text-slate-500">{bookings.length} total</span></div>{bookings.length ? <div className="space-y-3">{bookings.map((booking) => <article key={booking.id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><img src={booking.vehicle?.photos?.[0]} alt="" className="h-16 w-24 rounded-lg object-cover" /><div><Link to={`/booking/${booking.id}`} className="font-bold hover:text-blue-700">{booking.vehicle?.make} {booking.vehicle?.model}</Link><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{booking.vehicle?.city}<span>·</span><CalendarDays className="h-3.5 w-3.5" />{dateLabel(booking.startDate)} – {dateLabel(booking.endDate)}</p><p className="mt-1 text-xs font-semibold capitalize text-blue-700">{booking.status.replaceAll('_', ' ')}</p></div></div><div className="flex items-center justify-between gap-4 sm:justify-end"><span className="font-bold">₹{booking.priceBreakdown.totalPaise / 100}</span>{booking.status === 'confirmed' && <button onClick={() => cancelBooking(booking.id)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-red-200 hover:text-red-700">Cancel</button>}</div></article>)}</div> : <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">No bookings yet. <Link to="/vehicles" className="font-semibold text-blue-700">Browse vehicles</Link></div>}</section>

        {user.role === 'owner' && <section className="mt-9"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Your vehicle listings</h2><Link to="/list-vehicle" className="text-sm font-semibold text-blue-700">Add vehicle</Link></div>{vehicles.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{vehicles.map((vehicle) => <Link key={vehicle.id} to={`/vehicles/${vehicle.id}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><img src={vehicle.image} alt={vehicle.name} className="h-44 w-full object-cover" /><div className="p-4"><p className="font-bold">{vehicle.name}</p><p className="mt-1 text-sm text-slate-500">₹{vehicle.price.toLocaleString('en-IN')} / day · {vehicle.city}</p></div></Link>)}</div> : <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">You have not listed a vehicle yet.</div>}</section>}

        <section className="mt-9"><div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 text-xl font-bold"><Heart className="h-5 w-5 text-blue-600" />Saved vehicles</h2><span className="text-sm text-slate-500">{favorites.length} saved</span></div>{favorites.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{favorites.map((vehicle) => <article key={vehicle.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><Link to={`/vehicles/${vehicle.id}`}><img src={vehicle.image} alt={vehicle.name} className="h-44 w-full object-cover" /></Link><div className="flex items-center justify-between p-4"><Link to={`/vehicles/${vehicle.id}`} className="font-bold hover:text-blue-700">{vehicle.name}</Link><button onClick={() => removeFavorite(vehicle.id)} aria-label={`Remove ${vehicle.name} from saved vehicles`} className="text-sm font-medium text-slate-500 hover:text-red-600">Remove</button></div></article>)}</div> : <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Saved cars appear here. <Link to="/vehicles" className="font-semibold text-blue-700">Browse vehicles</Link></div>}</section>
      </main>
      <Footer />
    </div>
  );
}