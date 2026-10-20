import { useState } from 'react';
import { Search, MapPin, Calendar, Car, Sparkles, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [city, setCity] = useState('delhi');
  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState(tomorrow);

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-center items-center overflow-hidden bg-navy-dark text-white pt-24 pb-16">
      {/* Background gradients and glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark via-navy to-navy-dark pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-electric/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Subtle background grid */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        {/* Top Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-electric-light text-xs sm:text-sm font-medium mb-6 backdrop-blur-md shadow-sm">
          <Car className="w-4 h-4 text-electric" />
          <span>India's Trusted Self-Drive Car Rental Marketplace</span>
          <Sparkles className="w-3.5 h-3.5 text-warning" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Find Your <span className="gradient-text">Perfect Ride</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-base sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Drive verified cars from trusted hosts across India. Transparent pricing in integer paise, instant booking, zero hidden catches.
        </p>

        {/* Modern Search Widget (Clean White Card with Deep Shadow) */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl text-left border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Field 1: City Dropdown */}
            <div className="md:col-span-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-electric/10 text-electric flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <label htmlFor="city-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  City / Location
                </label>
                <div className="relative">
                  <select
                    id="city-select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-transparent text-navy font-semibold text-sm focus:outline-none cursor-pointer appearance-none pr-6"
                  >
                    <option value="delhi">Delhi NCR</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="bengaluru">Bengaluru</option>
                    <option value="jaipur">Jaipur</option>
                    <option value="pune">Pune</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Field 2: Pickup Date */}
            <div className="md:col-span-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-electric/10 text-electric flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <label htmlFor="pickup-date" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Pick-up Date
                </label>
                <input
                  id="pickup-date"
                  type="date"
                  min={today}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-transparent text-navy font-semibold text-sm focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Field 3: Return Date */}
            <div className="md:col-span-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-electric/10 text-electric flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <label htmlFor="return-date" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Return Date
                </label>
                <input
                  id="return-date"
                  type="date"
                  min={pickupDate || today}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent text-navy font-semibold text-sm focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Field 4: Search Button */}
            <div className="md:col-span-2">
              <button 
                type="button"
                className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-electric to-electric-dark hover:from-electric-dark hover:to-electric text-white font-bold text-sm shadow-md hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>

          </div>
        </div>

        {/* Quick Trust Statistics */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 mt-12 text-white/70">
          {[
            { value: '10,000+', label: 'Verified Vehicles' },
            { value: '50,000+', label: 'Happy Customers' },
            { value: '5', label: 'Major Cities' },
            { value: '4.8 ★', label: 'Average Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</div>
              <div className="text-xs text-white/50 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hover:opacity-100 transition-opacity">
        <div className="w-5 h-9 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1.5 h-2.5 bg-electric rounded-full" />
        </div>
      </div>
    </section>
  );
}
