import { Star, Fuel, Users, ChevronLeft, ChevronRight, Heart, MapPin, Settings2, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { useAuth } from '../../AuthContext';

const fallbackVehicles = [
  {
    id: 1,
    name: 'Hyundai Creta',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=260&fit=crop&auto=format',
    price: 2500,
    rating: 4.8,
    reviews: 124,
    fuel: 'Petrol',
    seats: 5,
    city: 'Delhi',
    transmission: 'Automatic',
  },
  {
    id: 2,
    name: 'Maruti Swift',
    type: 'Hatchback',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop&auto=format',
    price: 1200,
    rating: 4.6,
    reviews: 89,
    fuel: 'Petrol',
    seats: 5,
    city: 'Mumbai',
    transmission: 'Manual',
  },
  {
    id: 3,
    name: 'Honda City',
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=260&fit=crop&auto=format',
    price: 1800,
    rating: 4.7,
    reviews: 156,
    fuel: 'Diesel',
    seats: 5,
    city: 'Bengaluru',
    transmission: 'Manual',
  },
  {
    id: 4,
    name: 'Toyota Fortuner',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=260&fit=crop&auto=format',
    price: 4500,
    rating: 4.9,
    reviews: 67,
    fuel: 'Diesel',
    seats: 7,
    city: 'Jaipur',
    transmission: 'Automatic',
  },
  {
    id: 5,
    name: 'BMW 3 Series',
    type: 'Luxury',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=260&fit=crop&auto=format',
    price: 7500,
    rating: 4.9,
    reviews: 42,
    fuel: 'Petrol',
    seats: 5,
    city: 'Mumbai',
    transmission: 'Automatic',
  },
  {
    id: 6,
    name: 'Tata Nexon EV',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1619976215249-0bca8484acb3?w=400&h=260&fit=crop&auto=format',
    price: 2200,
    rating: 4.5,
    reviews: 34,
    fuel: 'Electric',
    seats: 5,
    city: 'Pune',
    transmission: 'Automatic',
  },
];

export default function FeaturedVehicles() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState(fallbackVehicles);
  const [startIdx, setStartIdx] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const visibleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

  useEffect(() => {
    let active = true;
    api('/vehicles?limit=6&sort=rating').then((result) => {
      if (active && result.vehicles.length) setVehicles(result.vehicles);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      return;
    }
    let active = true;
    api('/favorites').then((result) => {
      if (active) setFavorites(new Set(result.vehicles.map((vehicle) => vehicle.id)));
    }).catch(() => {});
    return () => { active = false; };
  }, [user]);

  const next = () => setStartIdx((i) => Math.min(i + 1, vehicles.length - visibleCount));
  const prev = () => setStartIdx((i) => Math.max(i - 1, 0));

  async function toggleFavorite(vehicle) {
    if (!user || typeof vehicle.id !== 'string' || vehicle.id.length !== 24) {
      navigate('/login', { state: { returnTo: '/vehicles' } });
      return;
    }
    const saved = favorites.has(vehicle.id);
    try {
      await api(`/favorites/${vehicle.id}`, { method: saved ? 'DELETE' : 'PUT' });
      setFavorites((current) => {
        const next = new Set(current);
        saved ? next.delete(vehicle.id) : next.add(vehicle.id);
        return next;
      });
    } catch {
      navigate('/login', { state: { returnTo: '/vehicles' } });
    }
  }

  return (
    <section className="py-20 lg:py-28 section-featured">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="section-kicker inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-normal rounded-full mb-4">
              Top Picks
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">
              Featured <span className="gradient-text">Vehicles</span>
            </h2>
            <p className="text-muted mt-2">Handpicked rides loved by our community</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={startIdx === 0}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:border-electric/60 hover:text-electric disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous vehicles"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={startIdx >= vehicles.length - visibleCount}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:border-electric/60 hover:text-electric disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next vehicles"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.slice(startIdx, startIdx + visibleCount).map((vehicle) => (
            <div
              key={vehicle.id}
              className="vehicle-card group rounded-2xl overflow-hidden transition-shadow duration-300"
            >
              <div className="relative h-60 sm:h-64 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-transparent to-black/10" />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm">
                    {vehicle.type}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-xs font-bold text-slate-900 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    {vehicle.rating}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(vehicle)}
                    aria-label={favorites.has(vehicle.id) ? `Remove ${vehicle.name} from favorites` : `Add ${vehicle.name} to favorites`}
                    aria-pressed={favorites.has(vehicle.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-sm transition-colors hover:text-blue-600"
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(vehicle.id) ? 'fill-rose-400 text-rose-400' : ''}`} />
                  </button>
                </div>
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm">
                  <Zap className="h-3.5 w-3.5 text-blue-600" /> Instant Booking
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold transition-colors group-hover:text-electric">{vehicle.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-electric" /> {vehicle.city}
                      <span className="text-white/25">·</span> {vehicle.reviews} reviews
                    </p>
                  </div>
                </div>

                <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-blue-600" />
                    {vehicle.fuel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    {vehicle.seats} Seats
                  </span>
                  <span className="flex items-center gap-1">
                    <Settings2 className="w-3.5 h-3.5 text-blue-600" />
                    {vehicle.transmission}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-3 border-t border-slate-200 pt-4">
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900">₹{vehicle.price.toLocaleString()}</span>
                    <span className="text-slate-400 text-sm">/day</span>
                  </div>
                  <Link to={typeof vehicle.id === 'string' && vehicle.id.length === 24 ? `/vehicles/${vehicle.id}` : '/vehicles'} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link to="/vehicles" className="inline-block rounded-xl border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
            View All Vehicles
          </Link>
        </div>
      </div>
    </section>
  );
}
