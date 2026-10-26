import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, MapPin, Fuel, Users, Settings2, Star, GitCompareArrows, Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString('en-IN')}`;
}

export default function BrowseVehicles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    fuel: searchParams.get('fuel') || '',
    pickupDate: searchParams.get('pickupDate') || '',
    returnDate: searchParams.get('returnDate') || '',
    q: searchParams.get('q') || '',
    sort: searchParams.get('sort') || 'rating',
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [compareIds, setCompareIds] = useState([]);
  const { user } = useAuth();

  const apiQuery = useMemo(() => {
    const query = new URLSearchParams();
    for (const key of ['city', 'category', 'maxPrice', 'fuel', 'q', 'sort']) {
      if (filters[key]) query.set(key, filters[key]);
    }
    if (filters.pickupDate) query.set('startDate', filters.pickupDate);
    if (filters.returnDate) query.set('endDate', filters.returnDate);
    return query.toString();
  }, [filters]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api(`/vehicles${apiQuery ? `?${apiQuery}` : ''}`)
      .then((result) => active && setVehicles(result.vehicles || []))
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [apiQuery]);

  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    let active = true;
    api('/favorites').then((result) => {
      if (active) setFavoriteIds(new Set(result.vehicles.map((vehicle) => vehicle.id)));
    }).catch(() => {});
    return () => { active = false; };
  }, [user]);

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function submitFilters(event) {
    event.preventDefault();
    const next = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && next.set(key, value));
    setSearchParams(next);
  }

  async function toggleFavorite(vehicle) {
    if (!user) {
      navigate('/login', { state: { returnTo: `${window.location.pathname}${window.location.search}` } });
      return;
    }
    const saved = favoriteIds.has(vehicle.id);
    try {
      await api(`/favorites/${vehicle.id}`, { method: saved ? 'DELETE' : 'PUT' });
      setFavoriteIds((current) => {
        const next = new Set(current);
        saved ? next.delete(vehicle.id) : next.add(vehicle.id);
        return next;
      });
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function toggleCompare(id) {
    setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 2 ? [...current, id] : current);
  }

  const comparedVehicles = vehicles.filter((vehicle) => compareIds.includes(vehicle.id));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-semibold text-blue-700">Browse vehicles</p><h1 className="mt-1 text-3xl font-bold">Find a car for your plans</h1><p className="mt-2 text-sm text-slate-600">Compare verified listings, daily rates, and vehicle details.</p></div>
          <Link className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700" to="/list-vehicle">List a vehicle</Link>
        </div>

        <form onSubmit={submitFilters} className="mb-7 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-semibold text-slate-600">City<select className={`${inputClass} mt-1`} name="city" value={filters.city} onChange={updateFilter}><option value="">All cities</option>{['Delhi', 'Mumbai', 'Bengaluru', 'Jaipur', 'Pune'].map((city) => <option key={city} value={city}>{city}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-600">Vehicle type<select className={`${inputClass} mt-1`} name="category" value={filters.category} onChange={updateFilter}><option value="">All types</option>{[['hatchback', 'Hatchback'], ['sedan', 'Sedan'], ['suv', 'SUV'], ['muv', 'MUV'], ['luxury', 'Luxury'], ['bike', 'Bike'], ['scooter', 'Scooter']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-600">Maximum daily price<input className={`${inputClass} mt-1`} name="maxPrice" type="number" min="1" max="100000" placeholder="₹2,000" value={filters.maxPrice} onChange={updateFilter} /></label>
          <label className="text-xs font-semibold text-slate-600">Fuel type<select className={`${inputClass} mt-1`} name="fuel" value={filters.fuel} onChange={updateFilter}><option value="">Any fuel</option>{['petrol', 'diesel', 'electric', 'cng', 'hybrid'].map((fuel) => <option key={fuel} value={fuel}>{fuel[0].toUpperCase() + fuel.slice(1)}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-600">Pick-up date<input className={`${inputClass} mt-1`} name="pickupDate" type="date" value={filters.pickupDate} onChange={updateFilter} /></label>
          <label className="text-xs font-semibold text-slate-600">Return date<input className={`${inputClass} mt-1`} name="returnDate" type="date" min={filters.pickupDate || undefined} value={filters.returnDate} onChange={updateFilter} /></label>
          <label className="text-xs font-semibold text-slate-600">Search<input className={`${inputClass} mt-1`} name="q" placeholder="Make or model" value={filters.q} onChange={updateFilter} /></label>
          <div className="flex items-end"><button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"><Search className="h-4 w-4" />Apply filters</button></div>
          <label className="text-xs font-semibold text-slate-600 sm:col-span-2 lg:col-span-1">Sort by<select className={`${inputClass} mt-1`} name="sort" value={filters.sort} onChange={updateFilter}><option value="rating">Top rated</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
        </form>

        <div className="mb-4 flex items-center justify-between"><p className="text-sm text-slate-600">{loading ? 'Loading vehicles…' : error ? 'Vehicles unavailable' : `${vehicles.length} vehicles found`}</p><p className="text-xs text-slate-500">Select up to two to compare</p></div>
        {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {!loading && !error && !vehicles.length && <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-600">No vehicles match these filters. Try a different city, type, or price range.</div>}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <article key={vehicle.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
              <Link to={`/vehicles/${vehicle.id}`} className="group relative block h-52 overflow-hidden bg-slate-100">
                <img src={vehicle.image} alt={`${vehicle.name} vehicle`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">{vehicle.type}</span>
              </Link>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3"><div><Link to={`/vehicles/${vehicle.id}`} className="text-lg font-bold hover:text-blue-700">{vehicle.name}</Link><p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-3.5 w-3.5 text-blue-600" />{vehicle.city}</p></div><span className="flex items-center gap-1 text-sm font-semibold"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{vehicle.rating || 'New'}</span></div>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600"><span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5 text-blue-600" />{vehicle.fuel}</span><span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-blue-600" />{vehicle.seats} seats</span><span className="flex items-center gap-1"><Settings2 className="h-3.5 w-3.5 text-blue-600" />{vehicle.transmission}</span></div>
                {vehicle.owner && <p className="mt-3 text-xs text-slate-500">Hosted by {vehicle.owner.fullName}</p>}
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4"><p><strong className="text-xl">{formatPrice(vehicle.price)}</strong><span className="text-sm text-slate-500"> / day</span></p><Link className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" to={`/vehicles/${vehicle.id}`}>View & book</Link></div>
                <div className="mt-3 flex items-center justify-between"><button type="button" onClick={() => toggleFavorite(vehicle)} aria-pressed={favoriteIds.has(vehicle.id)} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-700"><Heart className={`h-4 w-4 ${favoriteIds.has(vehicle.id) ? 'fill-rose-500 text-rose-500' : ''}`} />{favoriteIds.has(vehicle.id) ? 'Saved' : 'Save'}</button><button type="button" onClick={() => toggleCompare(vehicle.id)} className={`inline-flex items-center gap-1.5 text-xs font-medium ${compareIds.includes(vehicle.id) ? 'text-blue-700' : 'text-slate-600 hover:text-blue-700'}`}><GitCompareArrows className="h-4 w-4" />{compareIds.includes(vehicle.id) ? 'Selected' : 'Compare'}</button></div>
              </div>
            </article>
          ))}
        </div>

        {comparedVehicles.length === 2 && <section className="mt-10 overflow-x-auto rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-lg font-bold">Vehicle comparison</h2><table className="w-full min-w-[520px] text-left text-sm"><thead><tr><th className="py-2 text-slate-500">Specification</th>{comparedVehicles.map((vehicle) => <th key={vehicle.id} className="py-2">{vehicle.name}</th>)}</tr></thead><tbody>{[['Daily price', (vehicle) => `${formatPrice(vehicle.price)} / day`], ['Mileage', (vehicle) => `${vehicle.mileage} km/l`], ['Transmission', (vehicle) => vehicle.transmission], ['Seats', (vehicle) => vehicle.seats], ['Fuel type', (vehicle) => vehicle.fuel]].map(([label, value]) => <tr key={label} className="border-t border-slate-100"><th className="py-3 font-medium text-slate-500">{label}</th>{comparedVehicles.map((vehicle) => <td key={vehicle.id} className="py-3">{value(vehicle)}</td>)}</tr>)}</tbody></table><button onClick={() => setCompareIds([])} className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-800">Clear comparison</button></section>}
      </main>
      <Footer />
    </div>
  );
}