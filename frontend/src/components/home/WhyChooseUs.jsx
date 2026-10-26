import { ShieldCheck, Lock, Headphones, BadgePercent, CheckCircle2 } from 'lucide-react';

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
    <section className="trust-section py-20 lg:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="section-kicker inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-normal rounded-full mb-4">
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
              className="trust-card relative flex flex-col justify-between rounded-xl border p-6 transition-shadow duration-200 group"
            >
              <div>
                {/* Icon */}
                <div className="trust-icon mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 transition-colors duration-200">
                  <feat.icon className="w-7 h-7" />
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
              <div className="flex items-center gap-1.5 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-600">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
                <span>{feat.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="trust-metrics mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 sm:grid-cols-4">
          <TrustMetric value="10,000+" label="Verified vehicles" />
          <TrustMetric value="50,000+" label="Happy customers" />
          <TrustMetric value="5" label="Major cities" />
          <TrustMetric value="4.8 ★" label="Average rating" />
        </div>

      </div>
    </section>
  );
}

function TrustMetric({ value, label }) {
  return (
    <div className="trust-metric px-4 py-5 text-center sm:px-6 sm:py-6">
      <div className="text-2xl font-bold text-slate-900 sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs text-slate-400 sm:text-sm">{label}</div>
    </div>
  );
}
