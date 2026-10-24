import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const cities = [
  {
    name: 'Delhi',
    count: 3200,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop&auto=format',
    tagline: 'Capital rides',
  },
  {
    name: 'Mumbai',
    count: 2800,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop&auto=format',
    tagline: 'City of dreams',
  },
  {
    name: 'Bengaluru',
    count: 2100,
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop&auto=format',
    tagline: 'Garden city',
  },
  {
    name: 'Jaipur',
    count: 1500,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop&auto=format',
    tagline: 'Pink city',
  },
  {
    name: 'Pune',
    count: 1800,
    image: 'https://images.unsplash.com/photo-1572782252655-9c8771392601?w=400&h=300&fit=crop&auto=format',
    tagline: 'Oxford of the East',
  },
];

export default function PopularCities() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-kicker inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-normal rounded-full mb-4">
            Explore Cities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            Popular <span className="gradient-text">Destinations</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Find self-drive vehicles in India's most popular cities
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* First large card */}
          <Link to={`/vehicles?city=${encodeURIComponent(cities[0].name)}`} className="sm:col-span-2 lg:col-span-2 lg:row-span-2 group relative block h-64 overflow-hidden rounded-2xl lg:h-auto">
            <img
              src={cities[0].image}
              alt={cities[0].name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <div className="flex items-center gap-2 text-electric text-sm font-medium mb-2">
                <MapPin className="w-4 h-4" />
                {cities[0].tagline}
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">{cities[0].name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">{cities[0].count.toLocaleString()}+ vehicles</span>
                <div className="flex items-center gap-1 text-electric text-sm font-medium group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Smaller cards */}
          {cities.slice(1).map((city) => (
            <Link
              key={city.name}
              to={`/vehicles?city=${encodeURIComponent(city.name)}`}
              className="group relative block h-48 overflow-hidden rounded-2xl lg:h-auto"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-1 text-electric text-xs font-medium mb-1">
                  <MapPin className="w-3 h-3" />
                  {city.tagline}
                </div>
                <h3 className="text-lg font-bold text-white mb-0.5">{city.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">{city.count.toLocaleString()}+ vehicles</span>
                  <ArrowRight className="w-4 h-4 text-electric opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
