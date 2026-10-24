import { Car, Bike, Truck, Crown, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Hatchback',
    icon: Car,
    count: 1840,
    description: 'Agile, compact & budget-friendly. Perfect for swift city commutes and tight parking.',
    color: 'from-blue-500 to-electric',
    bgLight: 'bg-blue-50/80',
    textColor: 'text-blue-600',
    startingPrice: '800',
    popularModel: 'Swift, i20, Tiago',
  },
  {
    name: 'Sedan',
    icon: Car,
    count: 1560,
    description: 'Plush comfort, refined suspension & ample boot space for highway cruises and family trips.',
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50/80',
    textColor: 'text-emerald-600',
    startingPrice: '1,200',
    popularModel: 'City, Verna, Ciaz',
  },
  {
    name: 'SUV & MUV',
    icon: Truck,
    count: 2100,
    description: 'High ground clearance, commanding road view & power for getaways and hill drives.',
    color: 'from-orange-500 to-amber-500',
    bgLight: 'bg-orange-50/80',
    textColor: 'text-orange-600',
    startingPrice: '1,800',
    popularModel: 'Creta, Thar, Scorpio',
  },
  {
    name: 'Luxury & Premium',
    icon: Crown,
    count: 420,
    description: 'Executive class luxury, leather interiors, and unmatched prestige for special occasions.',
    color: 'from-purple-500 to-indigo-600',
    bgLight: 'bg-purple-50/80',
    textColor: 'text-purple-600',
    startingPrice: '5,000',
    popularModel: 'BMW 3, Mercedes C-Class',
  },
  {
    name: 'Electric Vehicles (EV)',
    icon: Zap,
    count: 340,
    description: 'Silent, instant acceleration and zero tailpipe emissions with home & fast-charging support.',
    color: 'from-teal-500 to-cyan-500',
    bgLight: 'bg-teal-50/80',
    textColor: 'text-teal-600',
    startingPrice: '1,500',
    popularModel: 'Nexon EV, ZS EV, Ioniq 5',
  },
  {
    name: 'Bikes & Scooters',
    icon: Bike,
    count: 980,
    description: 'Zippy two-wheelers and touring bikes for quick local errands and solo road trips.',
    color: 'from-rose-500 to-pink-500',
    bgLight: 'bg-rose-50/80',
    textColor: 'text-rose-600',
    startingPrice: '400',
    popularModel: 'Activa, Classic 350, Himalayan',
  },
];

export default function VehicleCategories() {
  return (
    <section className="py-20 lg:py-28 border-y border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Generous Breathing Room */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="section-kicker inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-normal rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Fleet</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight mb-4">
            Explore by <span className="gradient-text">Vehicle Category</span>
          </h2>
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
            From daily city runabouts to high-end luxury sedans and rugged terrain SUVs, discover the ride that matches your journey.
          </p>
        </div>

        {/* Spacious, Beautiful Grid with breathing room */}
        <div className="category-grid grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {categories.map((cat, index) => (
            <Link
              key={cat.name}
              to={`/vehicles?${cat.name === 'Electric Vehicles (EV)' ? 'fuel=electric' : `category=${cat.name.startsWith('SUV') ? 'suv' : cat.name.startsWith('Bikes') ? 'bike' : cat.name.startsWith('Hatchback') ? 'hatchback' : cat.name.startsWith('Luxury') ? 'luxury' : 'sedan'}`}`}
              className={`category-card group rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer relative overflow-hidden ${index < 2 ? 'category-card-wide' : ''}`}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-blue-500/40" />

              <div>
                {/* Header: Icon + Category Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="category-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition-colors duration-200 group-hover:bg-blue-100">
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold group-hover:text-electric transition-colors truncate">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      e.g. {cat.popularModel}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {cat.description}
                </p>
              </div>

              {/* Bottom Info Bar with comfortable spacing */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs mt-auto">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-semibold text-slate-300">
                  {cat.count.toLocaleString()} available
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">from</span>
                  <span className="text-base font-extrabold text-white">₹{cat.startingPrice}</span>
                  <span className="text-slate-400">/day</span>
                  <ArrowRight className="w-4 h-4 text-electric opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0.5 transition-all duration-200" />
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
