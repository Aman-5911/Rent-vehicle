import { ShieldCheck, Lock, Headphones, BadgePercent, Sparkles, CheckCircle2 } from 'lucide-react';

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: '100% Verified Vehicles',
    description: 'Every vehicle undergoes strict multi-point physical inspection, insurance verification, and roadworthiness validation before listing.',
    highlight: 'Comprehensive Verification'
  },
  {
    icon: Lock,
    title: 'Secure & Transparent Escrow',
    description: 'All payments and security deposits are calculated in exact integer paise with zero hidden markups. Instant refundable deposit release.',
    highlight: 'Bank-Grade Security'
  },
  {
    icon: Headphones,
    title: '24/7 Roadside Assistance',
    description: 'On-demand mechanical support, flat-tire assistance, towing, and emergency on-call concierge across all operational cities.',
    highlight: 'Round-the-Clock Support'
  },
  {
    icon: BadgePercent,
    title: 'Best Price Guarantee',
    description: 'Direct owner rates with automated weekly (7+ days) and monthly (30+ days) tier discounts applied transparently at checkout.',
    highlight: 'Volume Discounts'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-electric bg-electric/10 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trust & Safety First</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight mb-4">
            Why Choose <span className="gradient-text">RentWheels</span>?
          </h2>
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
            Engineered from day one for unmatched reliability, transparent pricing, and effortless self-drive mobility.
          </p>
        </div>

        {/* 4 Spacious Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustFeatures.map((feat) => (
            <div
              key={feat.title}
              className="relative p-7 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-electric/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 group flex flex-col justify-between"
            >
              <div>
                {/* Icon */}
                <div className="w-13 h-13 rounded-xl bg-white text-electric border border-slate-200/60 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-electric group-hover:to-electric-dark group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-sm mb-6">
                  <feat.icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-navy mb-3 group-hover:text-electric transition-colors leading-snug">
                  {feat.title}
                </h3>

                {/* Description with comfortable line-height */}
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {feat.description}
                </p>
              </div>

              {/* Bottom Feature Highlight Tag */}
              <div className="pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{feat.highlight}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
