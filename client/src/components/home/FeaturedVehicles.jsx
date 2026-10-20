import { Star, Fuel, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const vehicles = [
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
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400&h=260&fit=crop&auto=format',
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
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

  const next = () => setStartIdx((i) => Math.min(i + 1, vehicles.length - visibleCount));
  const prev = () => setStartIdx((i) => Math.max(i - 1, 0));

  return (
    <section className="py-20 lg:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric bg-electric/10 rounded-full mb-4">
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
              className="p-2.5 rounded-xl bg-white border border-border hover:border-electric hover:text-electric disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-card"
              aria-label="Previous vehicles"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={startIdx >= vehicles.length - visibleCount}
              className="p-2.5 rounded-xl bg-white border border-border hover:border-electric hover:text-electric disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-card"
              aria-label="Next vehicles"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.slice(startIdx, startIdx + 3).map((vehicle) => (
            <div
              key={vehicle.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-xs font-semibold bg-navy/80 text-white rounded-lg backdrop-blur-sm">
                    {vehicle.type}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 text-xs font-semibold bg-electric/90 text-white rounded-lg backdrop-blur-sm">
                    {vehicle.city}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-navy group-hover:text-electric transition-colors">
                    {vehicle.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="font-semibold text-navy">{vehicle.rating}</span>
                    <span className="text-muted">({vehicle.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted mb-4">
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5" />
                    {vehicle.fuel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {vehicle.seats} Seats
                  </span>
                  <span className="px-2 py-0.5 bg-surface rounded text-xs font-medium">
                    {vehicle.transmission}
                  </span>
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-border/50">
                  <div>
                    <span className="text-2xl font-extrabold text-navy">₹{vehicle.price.toLocaleString()}</span>
                    <span className="text-muted text-sm">/day</span>
                  </div>
                  <button className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-electric to-electric-dark rounded-xl hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 text-sm font-semibold text-electric border-2 border-electric rounded-xl hover:bg-electric hover:text-white transition-all duration-300">
            View All Vehicles
          </button>
        </div>
      </div>
    </section>
  );
}
