import { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Aarav Sharma',
    role: 'Customer (Renter)',
    city: 'Bengaluru',
    rating: 5,
    vehicle: 'Hyundai Creta (Trip to Coorg)',
    content: 'Flawless experience! The booking was smooth, the car was spotlessly clean, and pickup handover took less than 3 minutes. Much better than traditional self-drive rentals with zero hidden fuel catches.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces'
  },
  {
    id: 2,
    name: 'Pooja Iyer',
    role: 'Vehicle Host (Owner)',
    city: 'Mumbai',
    rating: 5,
    vehicle: 'Honda City (Active Host)',
    content: 'My Honda City was sitting parked 4 days a week. Listing on RentWheels covered my monthly EMI and maintenance completely. Renters are vetted and the inspection photos guarantee full safety.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces'
  },
  {
    id: 3,
    name: 'Vikram Malhotra',
    role: 'Customer (Renter)',
    city: 'Delhi NCR',
    rating: 5,
    vehicle: 'BMW 3 Series (Weekend Getaway)',
    content: 'Booked a luxury sedan for an anniversary trip to Agra. The pricing engine gave me clear transparency down to the exact rupee and paise. Refund on the security deposit was released on the same day!',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&fit=crop&crop=faces'
  }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-kicker inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-normal rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy mb-4">
            Loved by Drivers & <span className="gradient-text">Hosts Alike</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Real stories from our two-sided community across India
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="testimonial-card rounded-3xl p-8 sm:p-12 transition-all duration-300 relative border">
            <Quote className="w-16 h-16 text-electric/10 absolute top-8 right-8 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-electric/30 shadow-md shrink-0"
              />

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning fill-warning" />
                  ))}
                </div>

                <p className="text-navy text-lg sm:text-xl font-medium leading-relaxed italic mb-6">
                  "{t.content}"
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border">
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h4 className="font-bold text-navy text-lg">{t.name}</h4>
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-muted text-xs sm:text-sm">
                      {t.role} • {t.city} • <span className="text-electric font-medium">{t.vehicle}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={prev}
                      className="p-2.5 rounded-xl border border-border hover:border-electric hover:text-electric transition-colors"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={next}
                      className="p-2.5 rounded-xl border border-border hover:border-electric hover:text-electric transition-colors"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === idx ? 'w-8 bg-electric' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
