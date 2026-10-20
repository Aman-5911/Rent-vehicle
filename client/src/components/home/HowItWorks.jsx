import { Search, CreditCard, CarFront } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search & Compare',
    description: 'Browse thousands of verified vehicles in your city. Filter by type, price, and features to find your perfect match.',
    color: 'from-blue-500 to-electric',
    step: '01',
  },
  {
    icon: CreditCard,
    title: 'Book & Pay Securely',
    description: 'Reserve your vehicle with transparent pricing. Secure payments with full price breakdown — no hidden charges.',
    color: 'from-electric to-cyan-400',
    step: '02',
  },
  {
    icon: CarFront,
    title: 'Pick Up & Drive',
    description: 'Meet the owner, inspect the vehicle, and hit the road. Enjoy your trip with 24/7 roadside support.',
    color: 'from-cyan-400 to-emerald-400',
    step: '03',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric bg-electric/10 rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Get on the road in three simple steps. It's that easy.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-electric/20 via-electric/40 to-electric/20" />

          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group text-center"
            >
              {/* Step number */}
              <div className="absolute -top-3 right-4 text-7xl font-black text-navy/5 select-none">
                {step.step}
              </div>

              {/* Icon */}
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300`}>
                  <step.icon className="w-9 h-9 text-white" />
                </div>
                {/* Dot connector */}
                <div className="hidden md:block absolute -bottom-[2.85rem] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-electric border-4 border-white shadow-md z-10" />
              </div>

              <h3 className="text-xl font-bold text-navy mb-3">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
