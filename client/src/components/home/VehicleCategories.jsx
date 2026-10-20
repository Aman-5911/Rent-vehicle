import { Car, Bike, Truck, Crown, Zap, ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Hatchback',
    icon: Car,
    count: 1840,
    description: 'Compact & fuel-efficient city rides',
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    startingPrice: 800,
  },
  {
    name: 'Sedan',
    icon: Car,
    count: 1560,
    description: 'Comfortable rides for long journeys',
    color: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    startingPrice: 1200,
  },
  {
    name: 'SUV',
    icon: Truck,
    count: 2100,
    description: 'Spacious & powerful for every terrain',
    color: 'from-orange-500 to-orange-600',
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-600',
    startingPrice: 1800,
  },
  {
    name: 'Luxury',
    icon: Crown,
    count: 420,
    description: 'Premium experiences on wheels',
    color: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-600',
    startingPrice: 5000,
  },
  {
    name: 'Electric',
    icon: Zap,
    count: 340,
    description: 'Eco-friendly zero-emission rides',
    color: 'from-teal-500 to-teal-600',
    bgLight: 'bg-teal-50',
    textColor: 'text-teal-600',
    startingPrice: 1500,
  },
  {
    name: 'Bike / Scooter',
    icon: Bike,
    count: 980,
    description: 'Two-wheelers for quick city travel',
    color: 'from-rose-500 to-rose-600',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-600',
    startingPrice: 400,
  },
];

export default function VehicleCategories() {
  return (
    <section className="py-20 lg:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric bg-electric/10 rounded-full mb-4">
            Browse by Type
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            Vehicle <span className="gradient-text">Categories</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            From budget hatchbacks to luxury sedans — find the perfect vehicle for every occasion
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group relative bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              {/* Gradient corner accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${cat.color} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`} />

              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-14 h-14 ${cat.bgLight} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon className={`w-7 h-7 ${cat.textColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-navy group-hover:text-electric transition-colors">
                      {cat.name}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-muted text-sm mb-3">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${cat.textColor} ${cat.bgLight} px-2.5 py-1 rounded-md`}>
                      {cat.count.toLocaleString()} vehicles
                    </span>
                    <span className="text-xs text-muted">
                      from <span className="font-semibold text-navy">₹{cat.startingPrice}</span>/day
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
