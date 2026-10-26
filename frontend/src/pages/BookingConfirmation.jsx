import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { api } from '../api';

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/bookings/${id}`).then((result) => setBooking(result.booking)).catch((requestError) => setError(requestError.message));
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-32">
        {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!booking && !error && <p className="text-center text-slate-500">Loading booking…</p>}
        {booking && <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700"><CheckCircle2 className="h-7 w-7" /></div><p className="mt-5 text-sm font-semibold text-green-700">Booking confirmed</p><h1 className="mt-1 text-2xl font-bold">{booking.vehicle?.make} {booking.vehicle?.model}</h1><p className="mt-2 text-sm text-slate-600">{booking.vehicle?.city} · {formatDate(booking.startDate)} – {formatDate(booking.endDate)}</p><dl className="mt-7 space-y-3 border-t border-slate-200 pt-5 text-sm"><div className="flex justify-between"><dt className="text-slate-600">Rental total</dt><dd className="font-semibold">₹{booking.priceBreakdown.totalPaise / 100}</dd></div><div className="flex justify-between"><dt className="text-slate-600">Refundable deposit</dt><dd className="font-semibold">₹{booking.priceBreakdown.depositPaise / 100}</dd></div><div className="flex justify-between"><dt className="text-slate-600">Status</dt><dd className="font-semibold capitalize text-blue-700">{booking.status.replaceAll('_', ' ')}</dd></div></dl><p className="mt-5 text-xs leading-relaxed text-slate-500">Payment processing is not connected in this version. The booking and dates are stored in your account.</p><Link to="/dashboard" className="mt-7 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Go to dashboard</Link></section>}
      </main>
      <Footer />
    </div>
  );
}