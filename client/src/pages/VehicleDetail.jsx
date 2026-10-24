import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CalendarDays, Fuel, MapPin, Settings2, ShieldCheck, Star, Users } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { api } from '../api';
import { useAuth } from '../AuthContext';

function localDate(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function rupees(paise) {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`;
}

export default function VehicleDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [dates, setDates] = useState({ startDate: searchParams.get('pickupDate') || localDate(), endDate: searchParams.get('returnDate') || localDate(1) });
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    let active = true;
    api(`/vehicles/${id}`)
      .then((result) => { if (active) { setVehicle(result.vehicle); setReviews(result.reviews || []); } })
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (!vehicle || !dates.startDate || !dates.endDate || dates.endDate <= dates.startDate) {
      setQuote(null);
      return;
    }
    let active = true;
    const query = new URLSearchParams(dates);
    api(`/vehicles/${id}/quote?${query}`)
      .then((result) => active && setQuote({ ...result.priceBreakdown, available: result.available }))
      .catch(() => active && setQuote(null));
    return () => { active = false; };
  }, [id, vehicle, dates]);

  async function confirmBooking() {
    if (!user) {
      navigate('/login', { state: { returnTo: `/vehicles/${id}?pickupDate=${dates.startDate}&returnDate=${dates.endDate}` } });
      return;
    }
    setError('');
    setBooking(true);
    try {
      const result = await api('/bookings', { method: 'POST', body: { vehicleId: id, ...dates } });
      navigate(`/booking/${result.booking.id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        {loading && <p className="py-16 text-center text-slate-500">Loading vehicle…</p>}
        {!loading && error && !vehicle && <div className="rounded-xl border border-slate-200 bg-white p-8 text-center"><p className="text-slate-600">{error}</p><Link className="mt-4 inline-block font-semibold text-blue-700" to="/vehicles">Browse vehicles</Link></div>}
        {vehicle && <>
          <Link to="/vehicles" className="text-sm font-semibold text-blue-700 hover:text-blue-800">← Browse vehicles</Link>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                {vehicle.photos?.slice(0, 4).map((photo, index) => <img key={photo} src={photo} alt={`${vehicle.name} view ${index + 1}`} className={`h-56 w-full rounded-xl object-cover ${index === 0 ? 'sm:col-span-2 sm:h-[390px]' : ''}`} />)}
              </div>
              <div className="mt-7 flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold capitalize text-blue-700">{vehicle.category}</p><h1 className="mt-1 text-3xl font-bold">{vehicle.name}</h1><p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4 text-blue-600" />{vehicle.city}<span>·</span><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{vehicle.rating || 'New'} ({vehicle.reviews} reviews)</p></div><p className="text-2xl font-bold">{rupees(vehicle.pricePerDayPaise)}<span className="text-sm font-normal text-slate-500"> / day</span></p></div>
              <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-4"><span className="flex items-center gap-2 text-sm text-slate-700"><Fuel className="h-4 w-4 text-blue-600" />{vehicle.fuelType}</span><span className="flex items-center gap-2 text-sm text-slate-700"><Settings2 className="h-4 w-4 text-blue-600" />{vehicle.transmission}</span><span className="flex items-center gap-2 text-sm text-slate-700"><Users className="h-4 w-4 text-blue-600" />{vehicle.seats} seats</span><span className="flex items-center gap-2 text-sm text-slate-700"><ShieldCheck className="h-4 w-4 text-blue-600" />Verified listing</span></div>
              <section className="mt-7 rounded-xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">About this vehicle</h2><p className="mt-3 leading-relaxed text-slate-600">{vehicle.description || `${vehicle.year} ${vehicle.name}, available in ${vehicle.city}.`}</p>{vehicle.features?.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{vehicle.features.map((feature) => <span key={feature} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">{feature}</span>)}</div>}</section>
              <section className="mt-7 rounded-xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">Hosted by {vehicle.owner?.fullName || 'RentWheels owner'}</h2><p className="mt-2 text-sm text-slate-600">RentWheels host · {vehicle.owner?.totalTrips || 0} trips</p><p className="mt-1 text-xs text-slate-500">Member since {vehicle.owner?.memberSince ? new Date(vehicle.owner.memberSince).getFullYear() : 'recently'}</p></section>
              <section className="mt-7"><h2 className="text-xl font-bold">Reviews</h2>{reviews.length ? <div className="mt-4 space-y-3">{reviews.map((review) => <article key={review._id} className="rounded-xl border border-slate-200 bg-white p-5"><p className="font-semibold">{review.author?.fullName || 'Renter'} <span className="ml-2 text-amber-500">★ {review.rating}</span></p><p className="mt-2 text-sm text-slate-600">{review.body}</p></article>)}</div> : <p className="mt-3 text-sm text-slate-500">No reviews yet.</p>}</section>
            </div>

            <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24"><h2 className="text-lg font-bold">Choose your dates</h2><div className="mt-4 space-y-3"><label className="block text-xs font-semibold text-slate-600">Pick-up date<input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" type="date" min={localDate()} value={dates.startDate} onChange={(event) => setDates((current) => ({ ...current, startDate: event.target.value }))} /></label><label className="block text-xs font-semibold text-slate-600">Return date<input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" type="date" min={dates.startDate} value={dates.endDate} onChange={(event) => setDates((current) => ({ ...current, endDate: event.target.value }))} /></label></div>
              {quote && <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm"><p className={`mb-3 rounded-lg px-3 py-2 text-xs font-semibold ${quote.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{quote.available ? 'Available for these dates' : 'Unavailable for these dates'}</p><div className="flex justify-between text-slate-600"><span>{quote.days} day{quote.days > 1 ? 's' : ''} rental</span><span>{rupees(quote.basePaise)}</span></div>{quote.discountPaise > 0 && <div className="flex justify-between text-slate-600"><span>Duration discount</span><span>-{rupees(quote.discountPaise)}</span></div>}<div className="flex justify-between text-slate-600"><span>Platform fee</span><span>{rupees(quote.platformFeePaise)}</span></div><div className="flex justify-between text-slate-600"><span>GST</span><span>{rupees(quote.taxPaise)}</span></div><div className="flex justify-between border-t border-slate-200 pt-3 font-bold text-slate-900"><span>Total</span><span>{rupees(quote.totalPaise)}</span></div><div className="flex justify-between text-xs text-slate-500"><span>Refundable deposit</span><span>{rupees(quote.depositPaise)}</span></div></div>}
              {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button type="button" onClick={confirmBooking} disabled={booking || !quote || !quote.available || user?.role === 'owner'} className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{booking ? 'Confirming…' : user?.role === 'owner' ? 'Owner accounts cannot book' : user ? 'Confirm booking' : 'Sign in to book'}</button>
              <p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><CalendarDays className="h-4 w-4" />Dates are checked again when you confirm.</p>
            </aside>
          </div>
        </>}
      </main>
      <Footer />
    </div>
  );
}