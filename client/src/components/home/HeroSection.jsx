import { useState } from 'react';
import { Search, MapPin, Calendar, Car } from 'lucide-react';

export default function HeroSection() {
  const [city, setCity] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-electric/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-electric/8 rounded-full blur-3xl animate-float delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric/3 rounded-full blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric/10 border border-electric/20 text-electric text-sm font-medium mb-6 animate-fade-in-up">
            <Car className="w-4 h-4" />
            <span>India's #1 Self-Drive Car Rental Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-in-up delay-100">
            Find Your{' '}
            <span className="gradient-text">Perfect Ride</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
            Choose from thousands of verified vehicles across India. 
            Book instantly, drive freely. No hidden charges.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto animate-fade-in-up delay-300">
          <div className="glass rounded-2xl p-2 sm:p-3 shadow-elevated">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-3">
              {/* City */}
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-electric" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 text-white rounded-xl border border-white/10 focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/30 transition-all appearance-none text-sm"
                  aria-label="Select city"
                >
                  <option value="" className="text-navy">Select City</option>
                  <option value="delhi" className="text-navy">Delhi</option>
                  <option value="mumbai" className="text-navy">Mumbai</option>
                  <option value="bengaluru" className="text-navy">Bengaluru</option>
                  <option value="jaipur" className="text-navy">Jaipur</option>
                  <option value="pune" className="text-navy">Pune</option>
                </select>
              </div>

              {/* Pickup Date */}
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-electric" />
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 text-white rounded-xl border border-white/10 focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/30 transition-all text-sm [color-scheme:dark]"
                  aria-label="Pickup date"
                  placeholder="Pickup Date"
                />
              </div>

              {/* Return Date */}
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-electric" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 text-white rounded-xl border border-white/10 focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/30 transition-all text-sm [color-scheme:dark]"
                  aria-label="Return date"
                  placeholder="Return Date"
                />
              </div>

              {/* Search Button */}
              <button 
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-electric to-electric-dark text-white font-semibold rounded-xl hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 text-sm"
                aria-label="Search vehicles"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10 text-white/50 text-sm">
            {[
              { value: '10,000+', label: 'Verified Vehicles' },
              { value: '50,000+', label: 'Happy Customers' },
              { value: '5', label: 'Major Cities' },
              { value: '4.8★', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-white text-xl font-bold">{stat.value}</div>
                <div className="text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 bg-electric rounded-full" />
        </div>
      </div>
    </section>
  );
}
