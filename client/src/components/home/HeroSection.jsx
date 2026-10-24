import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Car, ChevronDown, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [city, setCity] = useState('delhi');
  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState(tomorrow);

  function searchVehicles() {
    const query = new URLSearchParams({ city: city === 'delhi' ? 'Delhi' : city, pickupDate, returnDate });
    navigate(`/vehicles?${query.toString()}`);
  }

  return (
    <section className="hero-section relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hero-intro mx-auto max-w-3xl text-center">
          <div className="hero-copy">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm sm:text-sm">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>India's trusted self-drive car rental marketplace</span>
            </div>
            <h1 className="mb-5 text-4xl font-bold leading-[1.08] tracking-normal text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Find your <span className="text-blue-700">perfect ride.</span>
            </h1>
            <p className="mx-auto mb-0 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Choose from verified cars near you. Clear pricing, trusted hosts, and a smoother way to get around.
            </p>
          </div>
        </div>

        <div className="hero-search mx-auto mt-8 max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-900/[0.04] sm:mt-9 sm:p-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.15fr_1fr_1fr_auto] md:items-center">
            <div className="hero-field flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 transition-colors hover:border-blue-200 hover:bg-white">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <label htmlFor="city-select" className="block text-xs font-medium text-slate-500">
                  Pick-up location
                </label>
                <div className="relative">
                  <select
                    id="city-select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-sm font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="delhi">Delhi NCR</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="bengaluru">Bengaluru</option>
                    <option value="jaipur">Jaipur</option>
                    <option value="pune">Pune</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Field 2: Pickup Date */}
            <div className="hero-field flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 transition-colors hover:border-blue-200 hover:bg-white">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <label htmlFor="pickup-date" className="block text-xs font-medium text-slate-500">
                  Pick-up date
                </label>
                <input
                  id="pickup-date"
                  type="date"
                  min={today}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full cursor-pointer bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Field 3: Return Date */}
            <div className="hero-field flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 transition-colors hover:border-blue-200 hover:bg-white">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <label htmlFor="return-date" className="block text-xs font-medium text-slate-500">
                  Return date
                </label>
                <input
                  id="return-date"
                  type="date"
                  min={pickupDate || today}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full cursor-pointer bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Field 4: Search Button */}
            <div>
              <button 
                type="button"
                onClick={searchVehicles}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 active:bg-blue-800 md:min-w-36"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>

          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 sm:mt-6 sm:text-sm">
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-600" /> Verified vehicles</span>
          <span className="inline-flex items-center gap-2"><Car className="h-4 w-4 text-blue-600" /> Transparent daily rates</span>
        </div>
      </div>
    </section>
  );
}
