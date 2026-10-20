import { ShieldCheck, Lock, Headphones, BadgePercent, Sparkles } from 'lucide-react';

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: '100% Verified Vehicles',
    description: 'Every vehicle undergoes strict physical inspection and digital document verification (RC, insurance & fitness checks).',
    badge: 'Inspected'
  },
  {
    icon: Lock,
    title: 'Secure & Transparent Payments',
    description: 'Safe escrow-style transactions in integer paise. No hidden charges, full breakdown, instant refundable deposits.',
    badge: 'Encrypted'
  },
  {
    icon: Headphones,
    title: '24/7 Roadside Assistance',
    description: 'Round-the-clock emergency support, emergency towing, and on-call concierge across all 5 operational cities.',
    badge: '24/7 Active'
  },
  {
    icon: BadgePercent,
    title: 'Best Price Guarantee',
    description: 'Direct owner rates with weekly (7+ days) and monthly (30+ days) discounted pricing tiers automatically applied.',
    badge: 'Discounts'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric bg-electric/10 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trust & Safety First</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy mb-4">
            Why Choose <span className="gradient-text">RentWheels</span>?
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Built from the ground up for maximum safety, transparent pricing, and effortless self-drive mobility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustFeatures.map((feat) => (
            <div
              key={feat.title}
              className="relative p-8 rounded-2xl bg-surface border border-border/80 hover:border-electric/50 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-electric/10 text-electric flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-electric group-hover:to-electric-dark group-hover:text-white transition-all duration-300 shadow-sm">
                  <feat.icon className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white border border-border text-navy/70">
                  {feat.badge}
                </span>
              </div>
              <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-electric transition-colors">
                {feat.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
